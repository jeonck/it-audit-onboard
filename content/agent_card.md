# Agent Card: A2A 에이전트의 디지털 신분증

**Agent Card**는 A2A (Agent-to-Agent) 프로토콜에서 각 에이전트의 **'디지털 신분증'**이자 **'기술 사양서 **(Specification)와 같습니다.

MSA 의 서비스 디스커버리 (Service Discovery) 가 서비스의 IP 와 포트를 알려준다면, Agent Card 는 해당 에이전트가 **"무엇을 할 수 있고 **(Capability)를 명시합니다.

---

## 1. Agent Card 의 정의

Agent Card 는 멀티 에이전트 환경에서 특정 에이전트의 **정체성과 능력을 표준화된 메타데이터 형식 **(주로 JSON/YAML)으로 기술한 문서입니다.

에이전트들이 협력 대상을 찾을 때 이 카드를 조회하여 협업 여부를 결정합니다.

```
┌─────────────────────────────────────────────────────────┐
│  Agent Card: 에이전트의 디지털 신분증                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐                                        │
│  │  Agent A    │  "나 이런 거 할 수 있어!"              │
│  └──────┬──────┘  "이런 권한 있어!"                     │
│         │         "이렇게 연락해!"                      │
│         ↓                                               │
│  ┌─────────────────────────────────────────┐           │
│  │  Agent Card (JSON/YAML)                 │           │
│  │  - Identity: whoami                     │           │
│  │  - Capability: [web-search, code-gen]   │           │
│  │  - Authority: security-level-2          │           │
│  │  - Interface: json-rpc, /api/v1         │           │
│  └─────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Agent Card 의 핵심 구성 요소 (Schema)

보안과 인프라 운영 관점을 반영한 주요 필드는 다음과 같습니다.

### Identity (신원)

| 필드명 | 설명 | 예시 |
|--------|------|------|
| **Agent ID** | 시스템 내의 고유 식별자 | `agent-sec-audit-001` |
| **Name** | 에이전트 이름 | `SecurityAuditAgent` |

---

### Capability (능력)

| 필드명 | 설명 | 예시 |
|--------|------|------|
| **Skills / Tools** | 에이전트가 가진 MCP 툴 목록 | `["web-browsing", "sql-query", "log-analysis"]` |
| **Domain / Bounded Context** | 해당 에이전트가 전문성을 가진 비즈니스 영역 | `security-audit`, `finance-report` |

---

### Policy (정책)

| 필드명 | 설명 | 예시 |
|--------|------|------|
| **Access Control **(ACL) | 접근 가능한 리소스 범위 및 보안 등급 | `security-level-2`, `read-only` |
| **Rate Limits** | 초당/분당 요청 제한 | `100 req/min` |

---

### Interface (인터페이스)

| 필드명 | 설명 | 예시 |
|--------|------|------|
| **Protocol** | A2A 통신 규격 | `JSON-RPC 2.0`, `gRPC`, `HTTP/REST` |
| **Endpoint** | 통신 주소 | `https://agent.example.com/api/v1` |

---

### Trust (신뢰)

| 필드명 | 설명 | 예시 |
|--------|------|------|
| **Certificate / Sign** | 신뢰할 수 있는 에이전트임을 증명하는 디지털 서명 | `SHA256:abc123...` |
| **Issuer** | 인증 기관 | `Internal-CA`, `DigiCert` |

---

### Agent Card 예시 (JSON)

```json
{
  "agentCard": {
    "identity": {
      "id": "agent-sec-audit-001",
      "name": "SecurityAuditAgent",
      "version": "1.2.0"
    },
    "capability": {
      "skills": ["web-browsing", "sql-query", "log-analysis"],
      "domain": "security-audit",
      "boundedContext": "security"
    },
    "policy": {
      "accessControl": "security-level-2",
      "rateLimits": {
        "requests": 100,
        "period": "minute"
      },
      "costLimit": {
        "maxTokens": 50000,
        "maxGpuTime": "10m"
      }
    },
    "interface": {
      "protocol": "JSON-RPC 2.0",
      "endpoint": "https://agent.example.com/api/v1",
      "authMethod": "OAuth2"
    },
    "trust": {
      "certificate": "SHA256:abc123...",
      "issuer": "Internal-CA",
      "validUntil": "2026-12-31T23:59:59Z"
    }
  }
}
```

---

## 3. A2A 워크플로우에서의 역할

엔지니어님의 MiroFish 프레임워크 내에서 Agent Card 는 다음과 같은 프로세스를 거치며 작동합니다.

### Registration (등록)

> 새로운 에이전트가 생성되면 자신의 Agent Card 를 중앙 **Registry**(전화번호부)에 등록합니다.

```
┌─────────────┐
│  New Agent  │
└──────┬──────┘
       │ Register Agent Card
       ↓
┌─────────────────────────────────────────┐
│  Registry (전화번호부)                  │
│  - agent-sec-audit-001 → [Card]         │
│  - agent-code-gen-002 → [Card]          │
│  - agent-data-003 → [Card]              │
└─────────────────────────────────────────┘
```

---

### Discovery (발견)

> 오케스트레이터 (또는 다른 에이전트) 가 **"보안 로그 분석이 가능한 에이전트"**를 검색하면, Registry 는 해당 능력이 기재된 Agent Card 를 반환합니다.

```
┌─────────────┐
│ Orchestrator│  "보안 로그 분석 가능한 에이전트 찾아줘"
└──────┬──────┘
       ↓ Query
┌─────────────────────────────────────────┐
│  Registry                               │
│  검색: capability contains "log-analysis"│
│  결과: agent-sec-audit-001 반환         │
└─────────────────────────────────────────┘
```

---

### Negotiation (Handshake)

> 에이전트끼리 대화하기 전, 서로의 Agent Card 를 확인하여 **"너 나랑 같은 보안 등급이야?", "너 내가 사용하는 MCP 프로토콜 지원해?"**를 검증합니다.

```
┌─────────────┐                    ┌─────────────┐
│  Agent A    │                    │  Agent B    │
│  Card 확인  │ ←──── A2A ───────→ │  Card 확인  │
│             │    Handshake       │             │
│  "보안 등급 2?"                   │  "JSON-RPC 지원?"
│  "OK" ✅                         │  "OK" ✅     │
└─────────────┘                    └─────────────┘
```

---

### AAR (After Action Report)

> 작업 완료 후, Agent Card 에 기재된 **기대 성능 **(SLA)과 **실제 성과**를 대조하여 에이전트의 품질을 평가합니다.

| 항목 | Agent Card 명세 | 실제 성과 | 평가 |
|------|---------------|----------|------|
| **응답 시간** | < 1 초 | 0.8 초 | ✅ 우수 |
| **정확도** | > 95% | 92% | ⚠️ 개선필요 |
| **토큰 사용** | < 50,000 | 45,000 | ✅ 우수 |

---

## 4. 인프라 전문가를 위한 설계 제언

20 년 경력의 노하우를 녹여 Agent Card 를 설계하신다면 다음 두 가지를 추가하는 것이 강력한 차별점이 될 것입니다.

### Cost & Resource Limit

> 에이전트가 사용할 수 있는 **최대 토큰 예산**이나 **GPU 점유 시간**을 Agent Card 에 명시하여 인프라 비용 폭주를 방지합니다.

```json
{
  "costLimit": {
    "maxTokens": 50000,
    "maxTokensPerDay": 500000,
    "maxGpuTime": "10m",
    "maxGpuTimePerDay": "2h",
    "budgetUSD": 10.00
  }
}
```

| 이점 | 설명 |
|------|------|
| **비용 폭주 방지** | 에이전트별 일일/월간 예산 제한 |
| **리소스 공정 분배** | GPU/CPU 시간 할당량 관리 |
| **과금 추적** | 에이전트별 사용량 기반 과금 |

---

### Version Drift Control

> 모델 업데이트 시 Agent Card 의 **버전도 함께 관리**하여, 모델 변경으로 인한 협업 로직의 붕괴 (Breaking Changes) 를 감지해야 합니다.

```json
{
  "versioning": {
    "agentVersion": "1.2.0",
    "modelVersion": "gpt-4o-2024-11-20",
    "protocolVersion": "A2A-1.0",
    "breakingChanges": ["1.0.0", "2.0.0"],
    "deprecatedAt": "2025-06-30T00:00:00Z"
  }
}
```

| 이점 | 설명 |
|------|------|
| **호환성 보장** | 버전 불일치 시 사전 경고 |
| **점진적 업데이트** | 구버전 에이전트와 공존 가능 |
| **변경 이력 추적** | 어떤 변경이 있었는지 감사 가능 |

---

## 📊 Agent Card vs MSA Service Discovery 비교

| 항목 | MSA Service Discovery | Agent Card |
|------|----------------------|------------|
| **목적** | 서비스 위치 (IP/Port) 발견 | 에이전트 능력/신뢰 발견 |
| **메타데이터** | 엔드포인트, 헬스체크 | Capability, Authority, Trust |
| **보안** | TLS, mTLS | 디지털 서명, 인증서 |
| **버전 관리** | 제한적 | 명시적 버전 드리프트 제어 |
| **비용 관리** | 없음 | 토큰/GPU 예산 명시 |
| **협상** | 없음 | Handshake, 협상 프로토콜 |

---

## 💡 실무 적용 가이드

### Agent Registry 구현 예시

```json
// Registry API: 에이전트 검색
GET /api/v1/agents/search?capability=log-analysis

// 응답
{
  "agents": [
    {
      "id": "agent-sec-audit-001",
      "name": "SecurityAuditAgent",
      "capability": ["log-analysis", "security-audit"],
      "trustLevel": "high",
      "endpoint": "https://agent.example.com/api/v1"
    }
  ]
}
```

### Agent Card 검증 로직

```python
def verify_agent_card(card):
    # 1. 서명 검증
    if not verify_signature(card['trust']['certificate']):
        return False
    
    # 2. 유효기간 확인
    if datetime.now() > card['trust']['validUntil']:
        return False
    
    # 3. 버전 호환성 확인
    if not is_compatible_version(card['versioning']['protocolVersion']):
        return False
    
    # 4. 비용 제한 확인
    if card['costLimit']['maxTokens'] > MAX_ALLOWED_TOKENS:
        return False
    
    return True
```

---

## 감리 관점에서의 시사점

정보시스템 감리 관점에서 Agent Card 도입 검토 시 고려사항:

1. **신원 검증**: 디지털 서명과 인증서를 통한 에이전트 신원 보증
2. **권한 관리**: ACL 기반 접근 통제와 최소 권한 원칙 준수
3. **감사 추적성**: Agent Card 등록/변경/폐기 이력 기록 보존
4. **버전 관리**: Version Drift Control 을 통한 호환성 보장
5. **비용 통제**: 토큰/GPU 예산 제한과 실제 사용량 모니터링
6. **신뢰 체인**: 인증 기관 (Issuer) 과 신뢰 수준 계층화
7. **AAR 품질 평가**: 명세 대비 실제 성과 비교와 지속적 개선

---

> **참고**: 본 자료는 정보시스템 감리 업무 수행 시 A2A 에이전트 신원 관리 검토를 위한 참고 자료입니다.
>
> **관련 표준**: A2A Protocol (draft), Agent Card Schema (proposed)
