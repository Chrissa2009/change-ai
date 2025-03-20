from pydantic import BaseModel

class Roi(BaseModel):
    value: float
    explanation: str

class Insight(BaseModel):
    title: str
    description: str
    contents: str

class Recommendation(BaseModel):
    title: str
    description: str
    contents: str

class Response(BaseModel):
    roi: Roi
    insights: list[Insight]
    recommendations: list[Recommendation]

class Form(BaseModel):
    category: str
    title: str
    description: str
    contents: str

class Request(BaseModel):
    forms: list[Form]