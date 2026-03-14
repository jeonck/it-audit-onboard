# Claude Skills vs MCP: 컨텍스트 효율화 전략

**Claude "Skills"**가 MCP(Model Context Protocol) 를 대체하거나 상호 보완할 수 있는 이유는 크게 **'결합도'**와 **'컨텍스트 효율성'**으로 요약할 수 있습니다.

특히 Claude Code 나 Desktop 앱에서 보여주는 Skills 의 행보는 MCP 가 지향하는 표준화와는 또 다른 **네이티브 최적화의 강점**을 가집니다.

---

## 1. MCP 와 Skills 의 구조적 차이

### MCP (분리형/표준형)

> 외부 서버 (MCP Server) 를 별도로 띄우고 **JSON-RPC 로 통신**하는 방식입니다.

| 특징 | 설명 |
|------|------|
| **범용성** | 높음 (표준 프로토콜) |
| **오버헤드** | 통신 오버헤드 발생 |
| **관리 비용** | 서버 관리 필요 |

```
┌─────────────────────────────────────────────────────────┐
│  MCP 아키텍처 (분리형)                                  │
├─────────────────────────────────────────────────────────┤
│  Claude Host ←→ MCP Client ←→ MCP Server ←→ Resource  │
│                                                         │
│  홉 (Hop): 3 단계                                       │
│  프로토콜: JSON-RPC 2.0                                 │
└─────────────────────────────────────────────────────────┘
```

---

### Skills (통합형/네이티브형)

> 모델의 추론 루프 내에 **직접 코드로 내장**되거나 매우 밀접하게 바인딩된 기능입니다.

**CLAUDE.md**나 프로젝트의 환경 설정 (Context) 에 따라 **즉각적으로 활성화**되는 **'특수 능력'**에 가깝습니다.

```
┌─────────────────────────────────────────────────────────┐
│  Skills 아키텍처 (통합형)                                │
├─────────────────────────────────────────────────────────┤
│  Claude Runtime                                         │
│  ┌─────────────────────────────────────────┐           │
│  │  Skills (내장 함수)                     │           │
│  │  - web-browsing                         │           │
│  │  - code-analysis                        │           │
│  │  - report-generation                    │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
│  홉 (Hop): 0 단계 (직접 호출)                           │
│  프로토콜: Native Function Call                         │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Skills 가 MCP 를 대체 (또는 능가) 할 수 있는 4 가지 이유

### ① 컨텍스트 오염 최소화 (Precision Context)

| 항목 | MCP | Skills |
|------|-----|--------|
| **토큰 소모** | 모든 도구 스키마 전달 | 최소한 인터페이스만 |
| **정확도** | 범용적 | 프로젝트 특화 |

> MCP 서버는 연결된 모든 도구의 스키마를 모델에게 한꺼번에 전달하여 토큰을 소모하는 경향이 있습니다.

> Skills 는 **특정 프로젝트나 워크플로우에만 최적화된 최소한의 인터페이스**를 가집니다.

#### 예시: agent-browser

> 엔지니어님께서 사용하시는 **agent-browser**의 기능을 MCP 서버 대신 Claude 의 직접적인 **'웹 브라우징 Skill'**로 구현하면, 프로토콜 변환 과정 없이 **더 정확한 참조 **(@e1, @e2)가 가능해집니다.

```
# MCP 방식 (오버헤드 있음)
Claude → MCP Client → MCP Server → agent-browser → @e1, @e2

# Skills 방식 (직접 호출)
Claude Skill → @e1, @e2 (즉시)
```

---

### ② 실행 속도와 지연 시간 (Zero-Latency)

| 방식 | 홉 (Hop) 수 | 응답 속도 |
|------|-----------|----------|
| **MCP** | 3 홉 (Host→Client→Server→Resource) | 느림 |
| **Skills** | 0 홉 (Runtime 내 직접 호출) | 빠름 |

> MCP 는 **Host ↔ Client ↔ Server ↔ Resource**라는 홉 (Hop) 을 거칩니다.

> Skills 는 **Claude 실행 환경 **(Runtime)로 작동하므로 응답 속도가 훨씬 빠릅니다.

이는 **Vibe Coding 시 리듬을 깨지 않는 핵심 요소**입니다.

---

### ③ 보안 및 권한 제어의 단순화

| 항목 | MCP | Skills |
|------|-----|--------|
| **보안 설정** | 서버마다 별도 설정 | Claude 권한 체계 내 통합 |
| **공격 표면** | 넓음 (여러 서버) | 좁음 (단일 환경) |

> MCP 는 서버마다 보안 설정을 따로 해야 하지만, Skills 는 **Claude 의 권한 체계 내에서 관리**됩니다.

#### 보안 전문가 관점

> 여러 개의 MCP 서버를 관리하며 각각의 취약점을 점검하는 것보다, **신뢰할 수 있는 Claude 환경 내에서 정의된 Skills 세트를 운영하는 것이 공격 표면 **(Attack Surface)할 수 있습니다.

```
┌─────────────────────────────────────────────────────────┐
│  보안 비교                                              │
├─────────────────────────────────────────────────────────┤
│  MCP:                                                   │
│  ┌──────┐  ┌──────┐  ┌──────┐  ← 각각 보안 설정 필요   │
│  │Server│  │Server│  │Server│     공격 표면 넓음       │
│  │  1   │  │  2   │  │  3   │                          │
│  └──────┘  └──────┘  └──────┘                          │
│                                                         │
│  Skills:                                                │
│  ┌─────────────────────────────────┐                   │
│  │  Claude Environment (통합)      │                   │
│  │  - Skill Set (중앙 관리)        │ ← 공격 표면 좁음  │
│  └─────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

---

### ④ 프로젝트 밀착형 최적화 (CLAUDE.md 연동)

> 엔지니어님께서 강조하시는 **CLAUDE.md**를 통한 **Context Hygiene 전략**은 Skills 와 결합할 때 더 강력합니다.

프로젝트의 성격 (예: Python 인프라 코드 작성 vs. React 프론트엔드) 에 따라 **필요한 Skills 만 동적으로 활성화**하여 모델의 **'전문가적 페르소나'**를 강화할 수 있습니다.

```yaml
# CLAUDE.md 예시
skills:
  active:
    - python-infrastructure
    - aws-control
    - security-audit
  disabled:
    - react-frontend
    - ui-design

context:
  domain: infrastructure
  securityLevel: high
```

---

## 3. Skills 생태계: skills.sh 플랫폼

**Skills 는 AI 에이전트를 위한 재사용 가능한 능력 **(reusable capabilities)입니다.

[**https://skills.sh/**](https://skills.sh/) 는 이러한 Skills 를 검색하고 설치할 수 있는 중앙 허브 역할을 합니다.

### Skills 플랫폼 특징

| 특징 | 설명 |
|------|------|
| **원클릭 설치** | `skills install <skill-name>` 명령어로 즉시 설치 |
| **절차적 지식 **(Procedural Knowledge) | 단순 도구가 아닌 '작업 수행 방법'을 인코딩 |
| **커뮤니티 기반** | 88,378+ 개 Skills, 전 세계 개발자 기여 |
| **재사용성** | 한 번 만든 Skills 를 여러 프로젝트에서 공유 |

---

### 인기 Skills 예시 (Top 15)

| 순위 | Skill 이름 | 설치수 | 제공자 |
|------|-----------|--------|--------|
| 1 | **svg logo designer** | 1.2K | rknall/claude-skills |
| 2 | **remotion** | 8.0K | google-labs-code/stitch-skills |
| 3 | **baoyu-markdown-to-html** | 7.9K | jimliu/baoyu-skills |
| 4 | **neon-postgres** | 7.8K | neondatabase/agent-skills |
| 5 | **baoyu-format-markdown** | 7.8K | jimliu/baoyu-skills |
| 6 | **chrome-devtools** | 7.7K | github/awesome-copilot |
| 7 | **github-issues** | 7.7K | github/awesome-copilot |
| 8 | **frontend-design-system** | 7.7K | supercent-io/skills-template |
| 9 | **code-review-excellence** | 7.7K | wshobson/agents |
| 10 | **humanizer-zh** | 7.6K | op7418/humanizer-zh |
| 11 | **proactive-agent** | 7.6K | halthelobster/proactive-agent |
| 12 | **image-generation-mcp** | 7.6K | supercent-io/skills-template |
| 13 | **agentic-principles** | 7.6K | supercent-io/skills-template |
| 14 | **vercel-react-best-practices** | 7.5K | supercent-io/skills-template |
| 15 | **web-design-reviewer** | 7.5K | github/awesome-copilot |

---

### Skills 카테고리별 예시

#### 인프라/DevOps

```bash
# AWS 인프라 제어
skills install aws-control
skills install neon-postgres

# 데이터베이스
skills install duckdb-query
```

#### 코드 품질

```bash
# 코드 리뷰
skills install code-review-excellence

# 테스트 생성
skills install playwright-generate-test
```

#### 프론트엔드

```bash
# React 모범 사례
skills install vercel-react-best-practices

# 디자인 시스템
skills install frontend-design-system
```

#### 에이전트 원칙

```bash
# 에이전트 행동 원칙
skills install agentic-principles

# 사전 대응 에이전트
skills install proactive-agent
```

---

### Skills 설치 및 사용

```bash
# Skills 검색
skills search logo

# Skills 설치
skills install svg-logo-designer

# Skills 목록 확인
skills list

# Skills 업데이트
skills update
```

---

### skills.sh 의 전략적 의미

| 관점 | 설명 |
|------|------|
| **생태계 확장** | 단일 조직이 아닌 커뮤니티 기반 Skills 진화 |
| **지식 축적** | 절차적 지식 (Procedural Knowledge) 의 표준화 및 공유 |
| **생산성 향상** | 매번 새로 만들지 않고 검증된 Skills 재사용 |
| **표준화** | 암묵적 노하우가 형식적 Skills 로 문서화 |

```
┌─────────────────────────────────────────────────────────┐
│  skills.sh 생태계                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐                                        │
│  │  skills.sh  │  ← 중앙 허브                          │
│  │  (88,378+)  │                                        │
│  └──────┬──────┘                                        │
│         │                                               │
│    ┌────┴────┐                                          │
│    ↓         ↓                                          │
│  ┌──────┐  ┌──────┐                                     │
│  │개인  │  │기업  │                                     │
│  │Skills│  │Skills│                                     │
│  └──────┘  └──────┘                                     │
│                                                         │
│  → 전 세계 개발자의 노하우 공유 및 재사용              │
└─────────────────────────────────────────────────────────┘
```

---

## 4. MCP vs Skills 비교표

| 항목 | MCP (Model Context Protocol) | Claude Skills |
|------|-----------------------------|---------------|
| **철학** | 생태계 통합, 범용 표준 | 네이티브 최적화, 사용자 경험 극대화 |
| **운영** | 별도 서버 프로세스 필요 | Claude 환경 내 내장/설정 |
| **유연성** | 타 모델 (GPT 등) 과 공유 가능 | Claude 생태계에 종속적 |
| **복잡도** | N×M 문제 해결에 유리 | 특정 프로젝트 생산성에 유리 |
| **컨텍스트** | 모든 도구 스키마 전달 | 최소한 인터페이스만 |
| **속도** | 3 홉 (Host→Client→Server) | 0 홉 (직접 호출) |
| **보안** | 서버별 별도 설정 | 통합 권한 관리 |
| **적합** | 전사적 도구 표준화 | 개인/프로젝트 생산성 |

---

## 5. 인프라 엔지니어링 리더를 위한 실무 인사이트

### 결론

> **MCP 는 '전사적 도구 표준화'에 적합**하고, **Skills 는 '엔지니어 개인 및 프로젝트 생산성'에 적합**합니다.

---

### 하이브리드 전략 (권장)

엔지니어님께서 구축 중인 **MiroFish**나 **BettaFish 프레임워크**에서는 다음과 같은 하이브리드 전략이 가장 효율적일 수 있습니다.

#### 공통 기반 (MCP)

> **DuckDB 조회, AWS 인프라 제어** 등 범용적인 도구는 MCP 서버로 유지하여 **재사용성**을 높입니다.

```
┌─────────────────────────────────────────────────────────┐
│  공통 기반 (MCP) - 재사용성 우선                       │
├─────────────────────────────────────────────────────────┤
│  - DuckDB 조회 MCP Server                               │
│  - AWS 인프라 제어 MCP Server                           │
│  - GitHub API MCP Server                                │
│                                                         │
│  → 여러 프로젝트/에이전트에서 공유 가능                │
└─────────────────────────────────────────────────────────┘
```

---

#### 특화 기능 (Skills)

> **agent-browser 를 이용한 특정 UI 조작**이나, **8D 보고서 자동 생성** 같은 고유한 비즈니스 로직은 **Claude Skill 형태**로 정의하여 **컨텍스트 효율**을 극대화합니다.

```
┌─────────────────────────────────────────────────────────┐
│  특화 기능 (Skills) - 생산성 우선                       │
├─────────────────────────────────────────────────────────┤
│  - agent-browser UI 조작 Skill                          │
│  - 8D 보고서 자동 생성 Skill                            │
│  - MiroFish 전용 워크플로우 Skill                       │
│                                                         │
│  → 프로젝트 특화, 컨텍스트 최소화, 속도 최대화         │
└─────────────────────────────────────────────────────────┘
```

---

### 하이브리드 아키텍처 예시

```
┌─────────────────────────────────────────────────────────┐
│  하이브리드 MiroFish/BettaFish 프레임워크              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐                                        │
│  │  Claude     │                                        │
│  │  (Runtime)  │                                        │
│  └──────┬──────┘                                        │
│         │                                               │
│    ┌────┴────┐                                          │
│    ↓         ↓                                          │
│  ┌──────┐  ┌─────────────────────────────────┐         │
│  │Skills│  │  MCP Servers (공통 기반)        │         │
│  │(특화)│  │  - DuckDB                       │         │
│  │      │  │  - AWS Control                  │         │
│  │- UI  │  │  - GitHub                       │         │
│  │- 8D  │  └─────────────────────────────────┘         │
│  │- WF  │                                               │
│  └──────┘                                               │
│                                                         │
│  → 생산성 + 재사용성 모두 확보                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 선택 가이드: MCP vs Skills

| 상황 | 권장 방식 | 이유 |
|------|----------|------|
| **전사적 표준화** | MCP | 여러 모델/팀 공유 필요 |
| **개인 생산성** | Skills | 컨텍스트 최소화, 속도 우선 |
| **범용 도구** | MCP | DuckDB, AWS, GitHub 등 |
| **특화 로직** | Skills | UI 조작, 8D 보고서 등 |
| **보안 통합** | Skills | 공격 표면 최소화 |
| **생태계 확장** | MCP | 벤더 중립, 상호운용성 |

---

## 감리 관점에서의 시사점

정보시스템 감리 관점에서 MCP vs Skills 검토 시 고려사항:

1. **표준성 vs 최적화**: MCP 는 표준화 (상호운용성), Skills 는 네이티브 최적화 (성능)
2. **공격 표면**: Skills 가 MCP 보다 공격 표면 (Attack Surface) 좁음
3. **감사 추적성**: MCP 는 서버별 로그, Skills 는 Claude 환경 내 로그 통합
4. **벤더 종속**: MCP 는 벤더 중립, Skills 는 Claude 생태계 종속
5. **유지보수**: MCP 는 서버 관리 필요, Skills 는 설정 관리만
6. **하이브리드 전략**: 공통 기반 (MCP) + 특화 기능 (Skills) 조합 권장

---

> **참고**: 본 자료는 정보시스템 감리 업무 수행 시 AI 도구 통합 전략 검토를 위한 참고 자료입니다.
>
> **관련 문서**: [MCP 공식 문서](https://modelcontextprotocol.io/), [Claude Skills](https://claude.ai/)
