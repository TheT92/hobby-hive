# env\Scripts\activate.bat
# uvicorn main:app -–reload

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import google.oauth2.id_token
from google.auth.transport import requests
from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
import starlette.status as status
import datetime

app = FastAPI()
firestore_db = firestore.Client()
firebase_request_adapter = requests.Request()

app.mount('/static', StaticFiles(directory='static'), name="static")
templates = Jinja2Templates(directory='templates')

def getUser(user_token):
    user = firestore_db.collection('users').document(user_token['user_id'])
    if not user.get().exists:
        user_data = {
            'name': 'Test User',
        }
        firestore_db.collection('users').document(user_token['user_id']).set(user_data)
    return user

def validateFirebaseToken(id_token):
    if not id_token:
        return None

    user_token = None
    try:
        user_token = google.oauth2.id_token.verify_firebase_token(id_token, firebase_request_adapter)
    except ValueError as err:
        print(str(err))

    return user_token
# <--------------------------------- UI Start --------------------------------->

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    id_token = request.cookies.get("token")
    user_token = validateFirebaseToken(id_token)
    if not user_token:
        return RedirectResponse('/login')
    
    return templates.TemplateResponse('index.html', { 'request': request, 'user_token': user_token, 'error_message': None })

@app.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    id_token = request.cookies.get("token")
    user_token = validateFirebaseToken(id_token)
    if user_token:
        return RedirectResponse('/')
    return templates.TemplateResponse('sign-in.html', {'request': request, 'error_message': None})


@app.get("/signUp", response_class=HTMLResponse)
async def signUp(request: Request):
    id_token = request.cookies.get("token")
    user_token = validateFirebaseToken(id_token)
    if user_token:
        return RedirectResponse('/')
    return templates.TemplateResponse('sign-up.html', {'request': request, 'error_message': None})


@app.get("/signIn", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse('sign-in.html', { 'request': request })

@app.get("/forgetPassword", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse('forget-password.html', { 'request': request })

@app.get("/updatePassword", response_class=HTMLResponse)
async def root(request: Request):
    id_token = request.cookies.get("token")
    user_token = validateFirebaseToken(id_token)
    if not user_token:
        return RedirectResponse('/login')
    return templates.TemplateResponse('update-password.html', { 'request': request })

@app.get("/chats", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse('chats.html', { 'request': request })

@app.get("/chat/{chatId}", response_class=HTMLResponse)
async def root(request: Request, chatId: str):
    return templates.TemplateResponse('chat.html', { 'request': request })

@app.get("/userCenter", response_class=HTMLResponse)
async def userCenter(request: Request):
    id_token = request.cookies.get("token")
    user_token = validateFirebaseToken(id_token)
    if not user_token:
        return RedirectResponse('/login')
    return templates.TemplateResponse('user-center.html', { 'request': request })

@app.get("/events", response_class=HTMLResponse)
async def root(request: Request):
    id_token = request.cookies.get("token")
    user_token = validateFirebaseToken(id_token)
    if not user_token:
        return RedirectResponse('/login')
    return templates.TemplateResponse('events.html', { 'request': request })

@app.get("/createEvent", response_class=HTMLResponse)
async def root(request: Request):
    id_token = request.cookies.get("token")
    user_token = validateFirebaseToken(id_token)
    if not user_token:
        return RedirectResponse('/login')
    return templates.TemplateResponse('event-form.html', { 'request': request })

@app.get("/updateEvent/{eventId}", response_class=HTMLResponse)
async def root(request: Request, eventId: str):
    return templates.TemplateResponse('event-form.html', { 'request': request })

@app.get("/event/{eventId}", response_class=HTMLResponse)
async def root(request: Request, eventId: str):
    return templates.TemplateResponse('event-detail.html', { 'request': request })

@app.get("/event", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse('event-detail.html', { 'request': request })

@app.get("/userHobbies", response_class=HTMLResponse)
async def userHobbies(request: Request):
    return templates.TemplateResponse('user-hobbies.html', { 'request': request })

# <---------------------------------- UI End ---------------------------------->


# <--------------------------------- API Start --------------------------------->

@app.post("/sign-up", response_class=RedirectResponse)
async def signUpPost(request: Request):
    return RedirectResponse('/signIn', status_code=status.HTTP_302_FOUND)

@app.post("/sign-in", response_class=RedirectResponse)
async def signInPost(request: Request):
    return RedirectResponse('/', status_code=status.HTTP_302_FOUND)

# <---------------------------------- API End ---------------------------------->