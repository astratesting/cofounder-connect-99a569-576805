from datetime import datetime
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    skills: Mapped[str] = mapped_column(Text, default='')
    interests: Mapped[str] = mapped_column(Text, default='')
    liveUrl: Mapped[str] = mapped_column(String(500), default='')
    pitchDeckUrl: Mapped[str] = mapped_column(String(500), default='')
    authProviderId: Mapped[str] = mapped_column(String(255), default='email')
    bio: Mapped[str] = mapped_column(Text, default='')
    createdAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updatedAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Match(Base):
    __tablename__ = 'matches'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user1Id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    user2Id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    status: Mapped[str] = mapped_column(String(30), default='pending')
    compatibilityScore: Mapped[float] = mapped_column(Float, default=0)
    createdAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updatedAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user1 = relationship('User', foreign_keys=[user1Id])
    user2 = relationship('User', foreign_keys=[user2Id])


class Message(Base):
    __tablename__ = 'messages'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    matchId: Mapped[int] = mapped_column(ForeignKey('matches.id'))
    senderId: Mapped[int] = mapped_column(ForeignKey('users.id'))
    content: Mapped[str] = mapped_column(Text)
    createdAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    readAt: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    match = relationship('Match')
    sender = relationship('User')
