from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, HttpUrl
from sqlalchemy import or_
from sqlalchemy.orm import Session
from database import get_db
from models import Match, Message, User
from routers.auth import get_current_user

router = APIRouter(prefix='/api', tags=['api'])


class ProfileUpdate(BaseModel):
    name: str | None = None
    skills: list[str] | None = None
    interests: list[str] | None = None
    liveUrl: HttpUrl | None = None
    pitchDeckUrl: HttpUrl | None = None
    bio: str | None = None


class SwipeRequest(BaseModel):
    targetUserId: int
    liked: bool


class MessageCreate(BaseModel):
    content: str


def _split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(',') if item.strip()]


def _user_dict(user: User) -> dict:
    return {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'skills': _split_csv(user.skills),
        'interests': _split_csv(user.interests),
        'liveUrl': user.liveUrl,
        'pitchDeckUrl': user.pitchDeckUrl,
        'authProviderId': user.authProviderId,
        'bio': user.bio,
        'createdAt': user.createdAt,
        'updatedAt': user.updatedAt,
    }


def _compatibility(user: User, candidate: User) -> float:
    my_terms = set(_split_csv(user.skills.lower())) | set(_split_csv(user.interests.lower()))
    their_terms = set(_split_csv(candidate.skills.lower())) | set(_split_csv(candidate.interests.lower()))
    if not my_terms or not their_terms:
        return 50.0
    overlap = len(my_terms & their_terms)
    spread = len(my_terms | their_terms)
    return round(55 + (overlap / spread) * 45, 2)


def _match_dict(match: Match, current_user_id: int) -> dict:
    other = match.user2 if match.user1Id == current_user_id else match.user1
    return {
        'id': match.id,
        'status': match.status,
        'compatibilityScore': match.compatibilityScore,
        'createdAt': match.createdAt,
        'updatedAt': match.updatedAt,
        'user': _user_dict(other),
    }


@router.get('/profiles/me')
def get_profile(current_user: User = Depends(get_current_user)):
    return _user_dict(current_user)


@router.put('/profiles/me')
def update_profile(payload: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if payload.name is not None:
        current_user.name = payload.name
    if payload.skills is not None:
        current_user.skills = ', '.join(payload.skills)
    if payload.interests is not None:
        current_user.interests = ', '.join(payload.interests)
    if payload.liveUrl is not None:
        current_user.liveUrl = str(payload.liveUrl)
    if payload.pitchDeckUrl is not None:
        current_user.pitchDeckUrl = str(payload.pitchDeckUrl)
    if payload.bio is not None:
        current_user.bio = payload.bio
    current_user.updatedAt = datetime.utcnow()
    db.commit()
    db.refresh(current_user)
    return _user_dict(current_user)


@router.get('/discover')
def discover(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    candidates = db.query(User).filter(User.id != current_user.id).limit(25).all()
    return [dict(_user_dict(candidate), compatibilityScore=_compatibility(current_user, candidate)) for candidate in candidates]


@router.post('/swipe')
def swipe(payload: SwipeRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    target = db.get(User, payload.targetUserId)
    if not target or target.id == current_user.id:
        raise HTTPException(status_code=404, detail='Candidate not found')
    status = 'matched' if payload.liked else 'passed'
    existing = db.query(Match).filter(
        or_(
            (Match.user1Id == current_user.id) & (Match.user2Id == target.id),
            (Match.user1Id == target.id) & (Match.user2Id == current_user.id),
        )
    ).first()
    if existing:
        existing.status = status
        existing.compatibilityScore = _compatibility(current_user, target)
        existing.updatedAt = datetime.utcnow()
        match = existing
    else:
        match = Match(user1Id=current_user.id, user2Id=target.id, status=status, compatibilityScore=_compatibility(current_user, target))
        db.add(match)
    db.commit()
    db.refresh(match)
    return _match_dict(match, current_user.id)


@router.get('/matches')
def matches(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rows = db.query(Match).filter(
        Match.status == 'matched',
        or_(Match.user1Id == current_user.id, Match.user2Id == current_user.id),
    ).all()
    return [_match_dict(row, current_user.id) for row in rows]


@router.get('/matches/{match_id}/messages')
def list_messages(match_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    match = db.get(Match, match_id)
    if not match or current_user.id not in [match.user1Id, match.user2Id]:
        raise HTTPException(status_code=404, detail='Match not found')
    rows = db.query(Message).filter(Message.matchId == match_id).order_by(Message.createdAt.asc()).all()
    return [{'id': row.id, 'matchId': row.matchId, 'senderId': row.senderId, 'content': row.content, 'createdAt': row.createdAt, 'readAt': row.readAt} for row in rows]


@router.post('/matches/{match_id}/messages')
def create_message(match_id: int, payload: MessageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    match = db.get(Match, match_id)
    if not match or match.status != 'matched' or current_user.id not in [match.user1Id, match.user2Id]:
        raise HTTPException(status_code=404, detail='Match not found')
    if not payload.content.strip():
        raise HTTPException(status_code=422, detail='Message content required')
    message = Message(matchId=match_id, senderId=current_user.id, content=payload.content.strip())
    db.add(message)
    db.commit()
    db.refresh(message)
    return {'id': message.id, 'matchId': message.matchId, 'senderId': message.senderId, 'content': message.content, 'createdAt': message.createdAt, 'readAt': message.readAt}


@router.post('/pitch-deck')
def save_pitch_deck(payload: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if payload.pitchDeckUrl is None:
        raise HTTPException(status_code=422, detail='pitchDeckUrl required')
    current_user.pitchDeckUrl = str(payload.pitchDeckUrl)
    current_user.updatedAt = datetime.utcnow()
    db.commit()
    return {'pitchDeckUrl': current_user.pitchDeckUrl, 'previewReady': True}
