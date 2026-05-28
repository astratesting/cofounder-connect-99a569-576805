import os
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, HttpUrl
from sqlalchemy.orm import Session
from database import get_db
from models import User

router = APIRouter(prefix='/auth', tags=['auth'])
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/login')
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-change-me')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    skills: list[str] = []
    interests: list[str] = []
    liveUrl: HttpUrl | None = None
    pitchDeckUrl: HttpUrl | None = None
    bio: str = ''
    authProviderId: str = 'email'


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    skills: list[str]
    interests: list[str]
    liveUrl: str
    pitchDeckUrl: str
    authProviderId: str
    bio: str
    createdAt: datetime
    updatedAt: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserResponse


def _split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(',') if item.strip()]


def _serialize_user(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        skills=_split_csv(user.skills),
        interests=_split_csv(user.interests),
        liveUrl=user.liveUrl,
        pitchDeckUrl=user.pitchDeckUrl,
        authProviderId=user.authProviderId,
        bio=user.bio,
        createdAt=user.createdAt,
        updatedAt=user.updatedAt,
    )


def _hash_password(password: str) -> str:
    return pwd_context.hash(password)


def _verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def _create_access_token(subject: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({'sub': subject, 'exp': expire}, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_error = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get('sub')
        if user_id is None:
            raise credentials_error
    except JWTError as exc:
        raise credentials_error from exc
    user = db.get(User, int(user_id))
    if user is None:
        raise credentials_error
    return user


@router.post('/register', response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail='Email already registered')
    user = User(
        name=payload.name,
        email=str(payload.email),
        password_hash=_hash_password(payload.password),
        skills=', '.join(payload.skills),
        interests=', '.join(payload.interests),
        liveUrl=str(payload.liveUrl or ''),
        pitchDeckUrl=str(payload.pitchDeckUrl or ''),
        authProviderId=payload.authProviderId,
        bio=payload.bio,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(access_token=_create_access_token(str(user.id)), user=_serialize_user(user))


@router.post('/login', response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not _verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail='Invalid email or password')
    return TokenResponse(access_token=_create_access_token(str(user.id)), user=_serialize_user(user))


@router.get('/me', response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return _serialize_user(current_user)
