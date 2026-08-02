$ErrorActionPreference = 'Stop'

$weeks = @(
  @{N=2; Module=2; Title='FastAPI Core & Dependency Injection'; Slug='fastapi-core'; Topics=@('Path operations, parameters & Pydantic models','Reusable dependencies with Depends()','OpenAPI, Swagger UI & ReDoc'); Code=@'
from typing import Annotated
from fastapi import Depends, FastAPI, Query

app = FastAPI()

def pagination(limit: Annotated[int, Query(ge=1, le=100)] = 20):
    return {"limit": limit}

@app.get("/tasks")
def list_tasks(page: Annotated[dict, Depends(pagination)]):
    return {"items": [], **page}
'@; Exercise='Build an in-memory books API with typed path and query parameters, a reusable pagination dependency, and useful OpenAPI descriptions.'; Quiz='Why is Depends() better than calling a shared helper directly?'; Answer='FastAPI can resolve, cache, override and document the dependency graph, which also makes the boundary straightforward to test.'},
  @{N=3; Module=3; Title='Building REST APIs'; Slug='rest-apis'; Topics=@('APIRouter and resource-oriented URLs','Request, response and patch models','Validation and centralized errors'); Code=@'
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/tasks", tags=["tasks"])

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_task(body: TaskCreate):
    return {"id": 1, **body.model_dump()}
'@; Exercise='Design CRUD endpoints for tasks, including separate create, update and response schemas and consistent 404 responses.'; Quiz='Why use a separate response model instead of returning the database object?'; Answer='It creates a stable public contract and prevents internal or sensitive fields from leaking.'},
  @{N=4; Module=4; Title='SQLAlchemy 2.0 Fundamentals'; Slug='sqlalchemy'; Topics=@('Declarative models and mapped columns','Session lifecycle as a dependency','Select, insert, update and transactions'); Code=@'
from sqlalchemy import select
from sqlalchemy.orm import Mapped, mapped_column

class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]

def find_task(session, task_id: int):
    return session.scalar(select(Task).where(Task.id == task_id))
'@; Exercise='Connect the tasks API to PostgreSQL, implement a per-request session dependency, and replace every in-memory operation with SQLAlchemy 2.0 queries.'; Quiz='Why should one request usually use one short-lived Session?'; Answer='It gives the request a clear transaction boundary and guarantees connections are returned to the pool.'},
  @{N=5; Module=4; Title='Relationships, Transactions & Alembic'; Slug='relationships'; Topics=@('One-to-many and many-to-many relationships','Loading strategies and the N+1 problem','Atomic transactions and Alembic migrations'); Code=@'
class Project(Base):
    __tablename__ = "projects"
    id: Mapped[int] = mapped_column(primary_key=True)
    tasks: Mapped[list["Task"]] = relationship(back_populates="project")

stmt = select(Project).options(selectinload(Project.tasks))
'@; Exercise='Add projects and task ownership, generate and review an Alembic migration, then prove rollback keeps the database consistent when a multi-write operation fails.'; Quiz='What problem does selectinload() solve?'; Answer='It loads related rows in a bounded extra query instead of triggering one query per parent row.'},
  @{N=6; Module=5; Title='Authentication with OAuth2 & JWT'; Slug='authentication'; Topics=@('Secure password hashing','OAuth2 password flow','Short-lived signed access tokens'); Code=@'
from datetime import datetime, timedelta, timezone
import jwt

def create_access_token(user_id: int) -> str:
    payload = {"sub": str(user_id), "exp": datetime.now(timezone.utc) + timedelta(minutes=15)}
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")
'@; Exercise='Implement registration, login and a protected /users/me endpoint. Store only password hashes and reject expired or invalid tokens.'; Quiz='Why must JWT payloads never contain secrets?'; Answer='A JWT is signed, not encrypted; clients can decode its payload even though they cannot safely alter it.'},
  @{N=7; Module=5; Title='Authorization & Refresh Tokens'; Slug='authorization'; Topics=@('Current-user dependencies','Scopes and role-based permissions','Refresh-token rotation and revocation'); Code=@'
def require_scope(required: str):
    def check(user = Depends(current_user)):
        if required not in user.scopes:
            raise HTTPException(status_code=403, detail="Insufficient permission")
        return user
    return check
'@; Exercise='Add admin-only task deletion and rotating refresh tokens. Reusing an old refresh token must revoke that token family.'; Quiz='When should an API return 401 versus 403?'; Answer='Use 401 when valid authentication is missing; use 403 when the authenticated identity lacks permission.'},
  @{N=8; Module=6; Title='Testing FastAPI Applications'; Slug='testing'; Topics=@('pytest fixtures and unit boundaries','TestClient and dependency overrides','PostgreSQL integration tests with Testcontainers'); Code=@'
def override_session():
    yield test_session

app.dependency_overrides[get_session] = override_session

def test_create_task(client):
    response = client.post("/tasks", json={"title": "Ship it"})
    assert response.status_code == 201
'@; Exercise='Write success, validation, authentication and not-found tests for the task API, then run the persistence suite against a disposable PostgreSQL container.'; Quiz='Why override the session dependency instead of mocking SQLAlchemy everywhere?'; Answer='The HTTP and persistence layers still run together while the test controls isolation and cleanup at one boundary.'},
  @{N=9; Module=7; Title='Service-to-Service Communication'; Slug='service-communication'; Topics=@('Async HTTP calls with httpx','Timeouts, retries and idempotency','Circuit breakers and graceful degradation'); Code=@'
import httpx

timeout = httpx.Timeout(2.0, connect=0.5)
async with httpx.AsyncClient(timeout=timeout) as client:
    response = await client.get(f"{USERS_URL}/users/{user_id}")
    response.raise_for_status()
'@; Exercise='Split user profiles into a second service and call it with strict timeouts. Return a useful degraded response when the dependency is unavailable.'; Quiz='Why is retrying every failed POST dangerous?'; Answer='A retry can repeat a non-idempotent side effect; use an idempotency key or retry only operations known to be safe.'},
  @{N=10; Module=7; Title='Background Work & Messaging'; Slug='messaging'; Topics=@('Celery tasks and RabbitMQ','Delivery guarantees and idempotent consumers','Retries, dead-letter handling and the outbox pattern'); Code=@'
@celery.task(bind=True, autoretry_for=(TemporaryError,), retry_backoff=True, max_retries=5)
def send_welcome_email(self, user_id: int):
    if email_log.already_sent(user_id):
        return
    mailer.send_welcome(user_id)
'@; Exercise='Publish a task-created event and consume it in an idempotent Celery worker. Demonstrate retry behavior without sending duplicate notifications.'; Quiz='What does at-least-once delivery require from a consumer?'; Answer='The consumer must be idempotent because the same message may legitimately be delivered more than once.'},
  @{N=11; Module=8; Title='Caching & Performance'; Slug='performance'; Topics=@('Redis cache-aside pattern','Safe invalidation and TTLs','Query profiling, pools and background tasks'); Code=@'
async def get_task(task_id: int):
    key = f"task:{task_id}"
    if cached := await redis.get(key):
        return TaskOut.model_validate_json(cached)
    task = await repository.get(task_id)
    await redis.set(key, TaskOut.model_validate(task).model_dump_json(), ex=60)
    return task
'@; Exercise='Cache task reads, invalidate on writes, then measure query count and response latency before and after the change.'; Quiz='Why is cache invalidation usually performed after a successful database commit?'; Answer='Invalidating earlier can expose stale or inconsistent states if the transaction later rolls back.'},
  @{N=12; Module=9; Title='Observability & Production Readiness'; Slug='observability'; Topics=@('Structured logs and request IDs','Liveness and readiness checks','Prometheus metrics and tracing context'); Code=@'
@app.get("/health/ready")
async def readiness():
    await database.execute(text("SELECT 1"))
    return {"status": "ready"}

REQUESTS = Counter("http_requests_total", "Requests", ["method", "route", "status"])
'@; Exercise='Add JSON logs with correlation IDs, separate live/ready endpoints, and request latency and count metrics without using raw URLs as labels.'; Quiz='Why should liveness not fail merely because the database is briefly unavailable?'; Answer='A restart cannot repair an external dependency and may create a restart loop; dependency checks belong in readiness.'},
  @{N=13; Module=10; Title='Containerization & Deployment'; Slug='deployment'; Topics=@('Small multi-stage Docker images','Non-root runtime and environment configuration','CI checks and production process models'); Code=@'
FROM python:3.12-slim AS runtime
WORKDIR /app
RUN addgroup --system app && adduser --system --ingroup app app
COPY --from=builder /app/.venv /app/.venv
COPY app ./app
USER app
CMD ["/app/.venv/bin/uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
'@; Exercise='Build a non-root image, add a health check, run migrations as a release step, and create a CI pipeline that tests before producing the image.'; Quiz='Why should migrations not run independently in every web worker at startup?'; Answer='Concurrent workers can race on the schema; a single controlled release step makes migration ordering explicit.'},
  @{N=14; Module=11; Title='Async Python & Concurrency'; Slug='async'; Topics=@('Event loop, coroutines and tasks','I/O-bound versus CPU-bound work','Threads, processes and task queues'); Code=@'
async def dashboard(user_id: int):
    profile, tasks = await asyncio.gather(
        users.get(user_id),
        task_repo.list_for_user(user_id),
    )
    return {"profile": profile, "tasks": tasks}
'@; Exercise='Call two independent I/O services sequentially and concurrently, measure both versions, then move a CPU-heavy report out of the event loop.'; Quiz='What happens when blocking I/O runs directly inside async def?'; Answer='It blocks the event-loop thread, preventing unrelated requests from progressing until that call returns.'},
  @{N=15; Module=12; Title='Capstone: Ship a Production FastAPI Service'; Slug='capstone'; Topics=@('Plan a coherent service and API contract','Secure, test and observe the system','Containerize, deploy and document it'); Code=@'
# Definition of done
# [ ] migrations and seed strategy
# [ ] authentication and authorization
# [ ] unit + integration + API tests
# [ ] logs, metrics, health checks
# [ ] non-root container and CI pipeline
# [ ] deployed URL and concise README
'@; Exercise='Build and deploy a portfolio-grade service such as issue tracking, bookings or inventory. Record architectural decisions and prove every definition-of-done item.'; Quiz='What makes this project production-ready rather than merely feature-complete?'; Answer='It includes operational qualities - security, tests, failure handling, observability, repeatable deployment and documentation - not just endpoints.'}
)

$nav = @'
<header class="navbar" data-navbar><div class="container navbar__inner"><a href="../index.html" class="brand"><svg class="brand__mark" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="22" fill="url(#brandGrad)"/><path d="M46 28 22 50l24 22M54 28l24 22-24 22" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="50" r="6.5" fill="#fff"/></svg>CodeVerse Creatives</a><nav class="nav-links"><a href="../index.html">Home</a><a href="../angular-syllabus.html">Angular</a><a href="../react-syllabus.html">React</a><a href="../llm-ml-syllabus.html">LLM &amp; ML</a><a href="../spring-boot-syllabus.html">Spring Boot</a><a href="../devops-cloud-syllabus.html">DevOps &amp; Cloud</a><a href="../python-syllabus.html" aria-current="page">Python</a><a href="../dsa-cpp-syllabus.html">DSA in C++</a></nav><div class="navbar__actions"><button class="theme-toggle" data-theme-toggle aria-label="Toggle color theme"><svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg><svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg></button><button class="nav-toggle" data-nav-toggle aria-label="Toggle navigation menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button></div></div></header>
'@

foreach ($w in $weeks) {
  $n = [int]$w.N
  $nn = '{0:D2}' -f $n
  $prev = '{0:D2}' -f ($n - 1)
  $next = if ($n -lt 15) { '{0:D2}' -f ($n + 1) } else { $null }
  $topicLinks = for ($i=0; $i -lt $w.Topics.Count; $i++) { '<a href="#topic-{0}"><span>{1}</span> {2}</a>' -f ($i+1),($i+1),$w.Topics[$i] }
  $topicSections = for ($i=0; $i -lt $w.Topics.Count; $i++) {
    $detail = @(
      'Start with the contract: make inputs, outputs and failure behavior explicit before adding infrastructure. This keeps the feature easy to reason about and gives tests a stable boundary.',
      'Apply the pattern through a small vertical slice. Keep framework wiring at the edge and business decisions in focused functions or services that can be tested without starting the whole application.',
      'Treat failure paths as part of the design. Add bounded resource usage, meaningful errors and a verification step so the behavior remains dependable under real production conditions.'
    )[$i]
    '<section id="topic-{0}"><h2>{1}. {2}</h2><p>{3}</p>{4}</section>' -f ($i+1),($i+1),$w.Topics[$i],$detail,$(if($i -eq 1){'<div class="code-block"><div class="code-block__label">core example</div><pre><code>'+[System.Net.WebUtility]::HtmlEncode($w.Code.Trim())+'</code></pre></div>'}else{''})
  }
  $objectives = ($w.Topics | ForEach-Object { '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>'+$_+'</li>' }) -join "`n"
  $nextPager = if ($next) { '<a href="week-'+$next+'.html" class="lesson-pager__link lesson-pager__link--next"><span class="lesson-pager__label">Next</span><span class="lesson-pager__title">Week '+($n+1)+'</span></a>' } else { '<a href="../python-syllabus.html" class="lesson-pager__link lesson-pager__link--next"><span class="lesson-pager__label">Course complete</span><span class="lesson-pager__title">Back to syllabus</span></a>' }
  $html = @"
<!DOCTYPE html><html lang="en"><head><script>(function(){try{var s=localStorage.getItem('cvc-theme');document.documentElement.setAttribute('data-theme',s||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'))}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();</script><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Week $n`: $($w.Title) &mdash; CodeVerse Creatives</title><meta name="description" content="Week $n of the Python and FastAPI curriculum: $([string]::Join(', ', $w.Topics))."/><link rel="icon" href="../favicon.svg" type="image/svg+xml"/><link rel="stylesheet" href="../css/style.css"/></head><body data-course="python"><svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:var(--accent)"/><stop offset="100%" style="stop-color:var(--accent-2)"/></linearGradient></defs></svg>
$nav
<main><section class="lesson-header"><div class="container"><div class="lesson-crumb"><a href="../python-syllabus.html">Python Syllabus</a><span>/</span><a href="../python-syllabus.html#timeline">Module $($w.Module)</a><span>/</span><span aria-current="page">Week $n</span></div><h1>Week $n`: $($w.Title)</h1><p class="lesson-header__lede">Build the next production-ready layer of your FastAPI service through clear concepts, a focused implementation and a practical exercise.</p><div class="lesson-meta"><span class="chip chip--accent">Module $($w.Module) of 12</span><span class="chip">Week $n of 15</span><span class="chip">~3-4 Hours</span><span class="chip">Hands-on Exercise Included</span></div><div class="obj-recap reveal"><h2>By the end of this week, you'll be able to</h2><ul>$objectives</ul></div><div class="phase-nav">$($topicLinks -join '')<a href="#exercise"><span>4</span> Exercise</a><a href="#quiz"><span>5</span> Knowledge Check</a></div></div></section>
<section class="section section--tight"><div class="container"><div class="lesson-layout"><article class="lesson-article">$($topicSections -join "`n")<section id="exercise"><h2>4. Hands-on Exercise</h2><div class="exercise-box"><h3>Build the feature</h3><p>$($w.Exercise)</p><h4>Definition of done</h4><ul><li>The happy path works through the real HTTP boundary.</li><li>At least one failure path is handled and tested.</li><li>Configuration and secrets stay outside source code.</li><li>The README explains how to run and verify the result.</li></ul></div></section><section id="quiz"><h2>5. Knowledge Check</h2><div class="quiz-item"><h4>$($w.Quiz)</h4><details><summary>Show answer</summary><p>$($w.Answer)</p></details></div></section><div class="lesson-pager"><a href="week-$prev.html" class="lesson-pager__link lesson-pager__link--prev"><span class="lesson-pager__label">Previous</span><span class="lesson-pager__title">Week $($n-1)</span></a>$nextPager</div></article><aside class="lesson-sidebar"><div class="sidebar-card"><h3>Week $n checklist</h3><ul><li>Read each concept</li><li>Run the example</li><li>Complete the exercise</li><li>Answer the knowledge check</li></ul></div><a href="../python-syllabus.html" class="btn btn--ghost" style="width:100%;justify-content:center">Back to syllabus</a></aside></div></div></section></main><footer class="footer"><div class="container footer__inner"><a href="../index.html" class="brand">CodeVerse Creatives</a><nav class="footer__links"><a href="../python-syllabus.html">Python syllabus</a><a href="#top">Back to top</a></nav><small>&copy; 2026 CodeVerse Creatives.</small></div></footer><script src="../js/main.js"></script></body></html>
"@
  Set-Content -LiteralPath (Join-Path $PSScriptRoot "..\python\week-$nn.html") -Value $html -Encoding utf8
}

# Keep the syllabus actionable: every timeline module links to its lesson page(s).
$syllabusPath = Join-Path $PSScriptRoot '..\python-syllabus.html'
$syllabus = Get-Content -Raw -Encoding utf8 -LiteralPath $syllabusPath
$groups = @(
  @{Title='FastAPI Core &amp; Dependency Injection'; Weeks=@(2)}, @{Title='Building REST APIs'; Weeks=@(3)},
  @{Title='Data Persistence with SQLAlchemy'; Weeks=@(4,5)}, @{Title='Authentication &amp; Security'; Weeks=@(6,7)},
  @{Title='Testing FastAPI Applications'; Weeks=@(8)}, @{Title='Microservices &amp; Messaging'; Weeks=@(9,10)},
  @{Title='Caching &amp; Performance'; Weeks=@(11)}, @{Title='Observability &amp; Production Readiness'; Weeks=@(12)},
  @{Title='Containerization &amp; Deployment'; Weeks=@(13)}, @{Title='Async Python &amp; Concurrency'; Weeks=@(14)},
  @{Title='Capstone: Ship a Production FastAPI Service'; Weeks=@(15)}
)
foreach ($group in $groups) {
  $firstWeek = '{0:D2}' -f [int]$group.Weeks[0]
  if ($syllabus -match "python/week-$firstWeek\.html") { continue }
  $links = ''
  foreach ($number in $group.Weeks) {
    $nn = '{0:D2}' -f $number
    $links += '<a href="python/week-' + $nn + '.html" class="course-card__cta" style="grid-column:1 / -1;">Start Week ' + $number + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a>'
  }
  $title = [regex]::Escape($group.Title)
  $pattern = "(?s)(<div class=`"timeline-card`">(?:(?!<div class=`"timeline-card`">).)*?<h3>$title</h3>.*?</ul>)(.*?</div>)"
  $syllabus = [regex]::Replace($syllabus, $pattern, ('$1' + $links + '$2'), 1)
}
Set-Content -LiteralPath $syllabusPath -Value $syllabus -Encoding utf8

$weekOnePath = Join-Path $PSScriptRoot '..\python\week-01.html'
$weekOne = Get-Content -Raw -Encoding utf8 -LiteralPath $weekOnePath
$weekOne = [regex]::Replace($weekOne, '<span class="lesson-pager__link lesson-pager__link--next is-disabled">.*?</span>\s*</span>', '<a href="week-02.html" class="lesson-pager__link lesson-pager__link--next"><span class="lesson-pager__label">Next</span><span class="lesson-pager__title">Week 2: FastAPI Core &amp; Dependency Injection</span></a>', 'Singleline')
Set-Content -LiteralPath $weekOnePath -Value $weekOne -Encoding utf8
