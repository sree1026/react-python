# from flask import Flask, send_from_directory
# from api.HelloApiHandler import HelloApiHandler
# from flask_cors import CORS
# from flask_restful import Resource, Api, reqparse

# app = Flask(__name__, static_url_path='', static_folder='frontend/build')
# CORS(app)
# api = Api(app)


# @app.route("/", defaults={'path': ''})
# def serve(path):
#     return send_from_directory(app.static_folder, 'index.html')


# api.add_resource(HelloApiHandler, '/flask/hello/')

from unicodedata import name
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Info(BaseModel):
    message: str


class Num(BaseModel):
    num1: int
    num2: int


@app.get("/users")
async def root():
    return {"message": "hello world!!!"}


# @app.get("/hello/{name}")
# async def hello(name):
#     return f"Welcome to python {name}!!!"

@app.get("/hello")
async def post_message():
    return {"message": "Backend is Python FastAPI"}


@app.post("/sum")
async def sum_2_nos(values: Num):
    return {"result": values.num1 + values.num2}

app.mount("/", StaticFiles(directory="frontend/build", html=True), name="Static")
