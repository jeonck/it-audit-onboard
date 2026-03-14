# MCP vs REST API: 주요 차이점 비교

**MCP **(Model Context Protocol)는 AI 에이전트와 외부 시스템 간의 표준화된 통신을 위해 설계된 프로토콜로, 기존의 REST API 와는 목적과 구조에서 근본적인 차이가 있습니다.

2025 년 Anthropic 을 중심으로 표준화가 추진된 MCP 는 AI 서비스 아키텍처에서 점점 더 중요한 역할을 하고 있습니다.

---

## 📊 MCP vs REST API 비교 표

| 비교 항목 | REST API | MCP (Model Context Protocol) |
|----------|----------|-----------------------------|
| **설계 목적** | 범용 웹 서비스 통신 | **AI 에이전트 -시스템 간 통신** |
| **주요 사용자** | 인간 개발자, 클라이언트 앱 | **AI 모델 **(LLM) |
| **통신 모델** | Request-Response (동기 중심) | **Tool Call + Result **(비동기 지원) |
| **데이터 형식** | JSON, XML 등 자유도 높음 | **JSON Schema 기반 엄격한 구조화** |
| **자기 기술 **(Self-Describing) | OpenAPI/Swagger (선택) | **필수 **(Tools, Resources, Prompts) |
| **발견 가능성** | 엔드포인트 수동 등록 필요 | **동적 도구 발견 **(Discovery) |
| **컨텍스트 관리** | 상태 없음 (Stateless) | **세션 기반 컨텍스트 유지** |
| **에러 처리** | HTTP 상태 코드 (200, 404, 500 등) | **구조화된 에러 객체 + 재시도 로직** |
| **인증 방식** | API Key, OAuth, JWT 등 다양 | **MCP 표준 인증 + Transport 계층** |
| **스트리밍** | SSE, WebSocket 별도 구현 | **네이티브 스트리밍 지원** |
| **배치 처리** | 별도 엔드포인트 필요 | **일괄 Tool Call 지원** |
| **버전 관리** | URL 경로 (/v1/, /v2/) | **프로토콜 협상 기반** |

---

## 1. 설계 철학의 차이

### REST API

> **자원 **(Resource) 중심의 아키텍처 스타일

```
┌─────────────┐      HTTP      ┌─────────────┐
│  Client     │ ────────────→  │   Server    │
│  (Human)    │ ←────────────  │   (API)     │
│             │   JSON Response │             │
└─────────────┘                └─────────────┘
```

- **CRUD 연산**에 최적화 (GET, POST, PUT, DELETE)
- **엔드포인트 설계**가 개발자의 의도에 따라 달라짐
- **문서화 **(OpenAPI)가 선택적

---

### MCP

> **도구 **(Tool) 중심의 AI 에이전트 통신 프로토콜

```
┌─────────────┐    MCP Protocol   ┌─────────────┐
│  AI Agent   │ ───────────────→  │  MCP Server │
│  (LLM)      │ ←───────────────  │  (Tools)    │
│             │   Structured Tool │             │
│             │   Call + Result   │             │
└─────────────┘                └─────────────┘
```

- **Tool Call**에 최적화 (함수 호출 패러다임)
- **자기 기술 **(Self-Describing)이 필수 (AI 가 직접 이해)
- **동적 발견 **(Discovery)으로 AI 가 실시간 도구 탐색

---

## 2. 메시지 구조 비교

### REST API 요청 예시

```http
POST /api/v1/orders HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "product_id": "P123",
  "quantity": 2,
  "customer_id": "C456"
}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "order_id": "O789",
  "status": "pending",
  "total": 59.98
}
```

---

### MCP Tool Call 예시

```json
// AI → MCP Server (Tool Call)
{
  "method": "tools/call",
  "params": {
    "name": "create_order",
    "arguments": {
      "product_id": "P123",
      "quantity": 2,
      "customer_id": "C456"
    }
  }
}
```

```json
// MCP Server → AI (Tool Result)
{
  "content": [
    {
      "type": "text",
      "text": "{\"order_id\": \"O789\", \"status\": \"pending\", \"total\": 59.98}"
    }
  ],
  "isError": false
}
```

---

## 3. 도구 발견 (Discovery) 메커니즘

### REST API

> **수동 등록 필요** - 개발자가 API 문서를 읽고 클라이언트 코드에 하드코딩

```python
# 개발자가 직접 엔드포인트 정의
response = requests.post(
    "https://api.example.com/v1/orders",
    json={"product_id": "P123", "quantity": 2}
)
```

---

### MCP

> **동적 발견** - AI 가 실행 시점에 사용 가능한 도구 목록을 자동으로 조회

```json
// AI → MCP Server (List Tools)
{
  "method": "tools/list"
}

// MCP Server → AI (Tools Response)
{
  "tools": [
    {
      "name": "create_order",
      "description": "Create a new order in the system",
      "inputSchema": {
        "type": "object",
        "properties": {
          "product_id": {"type": "string"},
          "quantity": {"type": "integer"},
          "customer_id": {"type": "string"}
        },
        "required": ["product_id", "quantity", "customer_id"]
      }
    }
  ]
}
```

---

## 4. AI 통합 관점 비교

| 항목 | REST API 통합 | MCP 통합 |
|------|-------------|---------|
| **LLM 이해도** | 낮음 (개발자가 변환 필요) | **높음 **(구조화된 Tool 정의) |
| **프롬프트 엔지니어링** | 수동으로 API 명세 설명 | **자동으로 Tool 스키마 제공** |
| **할루시네이션** | 엔드포인트 오기입 가능성 | **스키마 검증으로 방지** |
| **확장성** | 새로운 엔드포인트마다 코드 수정 | **동적 발견으로 자동 인식** |
| **에러 복구** | 개발자가 에러 처리 로직 구현 | **재시도 + 대체 Tool 제안 가능** |

---

## 5. 사용 사례별 권장 선택

### REST API 가 적합한 경우

| 시나리오 | 이유 |
|----------|------|
| **전통적 웹/모바일 앱** | 인간 사용자가 직접 조작 |
| **단순 CRUD 연산** | 자원 생성/조회/수정/삭제 중심 |
| **공개 API 제공** | 범용 클라이언트 지원 필요 |
| **기존 시스템 통합** | 레거시 인프라와의 호환성 |

---

### MCP 가 적합한 경우

| 시나리오 | 이유 |
|----------|------|
| **AI 에이전트 개발** | LLM 이 직접 도구 호출 |
| **RAG 파이프라인** | 동적 데이터 소스 연결 |
| **자동화 워크플로우** | AI 기반 의사결정 + 실행 |
| **멀티 Tool 오케스트레이션** | 여러 도구 간 협업 필요 |

---

## 6. 하이브리드 아키텍처: MCP Gateway 패턴

> 현실적으로는 **REST API 를 MCP 로 감싸서 사용**하는 패턴이 일반적입니다.

```
┌─────────────┐
│  AI Agent   │
│  (LLM)      │
└──────┬──────┘
       │ MCP Protocol
       ↓
┌─────────────────────────────────┐
│       MCP Gateway               │
│  (MCP ↔ REST 변환 레이어)       │
└──────┬──────────────────────────┘
       │ REST API
       ↓
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Order API  │  │  User API   │  │  Product API│
└─────────────┘  └─────────────┘  └─────────────┘
```

### MCP Gateway 의 역할

1. **Tool Discovery**: REST 엔드포인트를 MCP Tool 로 변환
2. **스키마 생성**: OpenAPI 스펙을 JSON Schema 로 자동 변환
3. **프로토콜 변환**: MCP Tool Call ↔ REST HTTP 요청
4. **에러 처리**: REST 에러를 MCP 구조화된 에러로 변환

---

## 💡 실무 팁: 언제 무엇을 사용할까?

### 상황별 권장 아키텍처

| 상황 | 권장 방식 |
|------|----------|
| **기존 REST API + AI 추가** | MCP Gateway 로 감싸기 |
| **새로운 AI 네이티브 서비스** | MCP 네이티브 구현 |
| **공개 API 제공** | REST + MCP 동시 지원 |
| **내부 AI 에이전트** | MCP 전용 |
| **모바일/웹 클라이언트** | REST 전용 |

---

## 감리 관점에서의 시사점

정보시스템 감리 관점에서 MCP vs REST API 검토 시 고려사항:

1. **프로토콜 표준성**: MCP 는 표준화 진행 중, REST 는 성숙한 표준
2. **보안 검증**: 인증/인가 메커니즘의 완결성과 검증 이력
3. **감사 추적성**: Tool Call 이력과 REST 로그의 무결성 보장
4. **상호운용성**: 기존 REST 인프라와의 통합 용이성
5. **문서화 요구**: MCP 는 자기기술 필수, REST 는 OpenAPI 권장
6. **성능 오버헤드**: MCP 변환 레이어 추가 시 지연 시간 영향
7. **벤더 종속성**: MCP 는 Anthropic 중심, REST 는 벤더 중립

---

> **참고**: 본 자료는 정보시스템 감리 업무 수행 시 AI 통신 프로토콜 검토를 위한 참고 자료입니다.
>
> **MCP 공식 문서**: [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)
>
> **REST API 설계 가이드**: [https://restfulapi.net/](https://restfulapi.net/)
