# ReAct 패턴 (Reasoning + Acting)

ReAct 패턴 (Reasoning + Acting) 은 2022 년 Yao et al. 논문에서 제안된 **AI 에이전트의 가장 대표적인 제어 패턴** 중 하나입니다.

현재 (2026 년) 거의 모든 에이전트 프레임워크 (LangChain, LlamaIndex, CrewAI, AutoGen, LangGraph 등) 에서 기본으로 채택되고 있으며, **Compound AI 시스템이나 Agentic 워크플로우의 핵심 빌딩 블록**으로 자리 잡았습니다.

---

## ReAct 의 핵심 아이디어 (한 줄 요약)

> **LLM 이 "생각 (Reasoning)"과 "행동 (Acting)"을 번갈아 반복하면서 외부 환경과 상호작용하며 문제를 점진적으로 해결한다.**

| | |
|---|---|
| **단순 CoT (Chain-of-Thought)** | 생각만 함 (환각·오류 누적 쉬움) |
| **단순 Tool Use** | 행동만 함 (계획 없이 무작정 호출) |
| **ReAct** | **생각 → 행동 → 관찰 → 다시 생각 → …** (인간처럼 동적·피드백 기반) |

---

## ReAct 의 동작 흐름 (단계별 상세 설명)

ReAct 은 반복 루프 (Loop) 로 작동하며, 보통 아래 4 단계가 사이클을 이룹니다.

이 루프는 **종료 조건** (Final Answer 출력, 최대 스텝 도달, 목표 달성 등) 이 될 때까지 반복됩니다.

| 단계 | 이름 (영문) | LLM 이 하는 일 | 출력 형식 예시 | 다음으로 이어지는 것 | 목적 / 강점 |
|------|------------|--------------|---------------|---------------------|------------|
| **1** | **Thought (생각)** | 현재 상황 + 이전 히스토리 분석 → 다음 행동 계획 세움 (CoT 스타일 자유 텍스트) | `Thought: 현재 정보가 부족하다. 서울 인구를 검색해야 함.` | Action 호출 | 계획 수립, 오류 수정, 예외 처리, 다단계 분해 가능 |
| **2** | **Action (행동)** | 구체적인 도구 호출 결정 (Tool name + 파라미터) | `Action: search[서울 인구]` | 외부 환경 (도구) 이 실행 → Observation 생성 | 외부 지식·계산·API 호출 등 실제 작업 수행 |
| **3** | **Observation (관찰)** | 도구 실행 결과가 컨텍스트로 돌아옴 (LLM 이 직접 생성하지 않음) | `Observation: 서울 인구는 약 970 만 명이다 (2025 기준).` | 다시 Thought 로 돌아감 | 실시간 피드백 → 환각 줄이고 grounding 강화 |
| **4** | **(반복 또는 종료)** | Thought 에서 "이제 충분하다" 판단 → Final Answer 출력 | `Final Answer: 서울의 인구는 약 970 만 명이다.` | 루프 종료 | 최종 답변 도출, 인간이 읽기 쉬운 traceable trajectory 생성 |

---

## 전체 흐름 예시 (HotpotQA 스타일 다단계 질문 해결)

```
Thought: "질문: '아이언맨' 배우 로버트 다우니 주니어의 데뷔작은? 
         → 배우 이름은 알지만 데뷔작 모름. 영화 목록 검색 필요."

Action: search["로버트 다우니 주니어 데뷔 영화"]

Observation: "로버트 다우니 주니어의 첫 영화는 1970 년 'Pound'이다."

Thought: "데뷔작 확인됨. 하지만 '아이언맨' 관련인지 확인 필요. 
         추가 검색: 아이언맨 출연 배우 목록."

Action: search["아이언맨 영화 출연 배우"]

Observation: "... 로버트 다우니 주니어가 토니 스타크 역..."

Thought: "모든 정보 모음. 이제 답변 가능."

Final Answer: 로버트 다우니 주니어의 데뷔작은 1970 년 영화 'Pound'이다.
```

---

## ReAct 의 프롬프트 템플릿 (실무에서 가장 많이 쓰이는 기본 형식)

```text
You are a helpful AI agent. Solve the task using this format ONLY:

Thought: [자유롭게 단계별로 생각하기]
Action: [tool_name[파라미터]]   ← 또는 Action Input: JSON 형태
Observation: [도구 결과는 여기에 들어옴 — LLM 은 쓰지 않음]

... 반복 ...

Final Answer: [최종 답변]
```

> **Few-shot 예시 1~3 개 넣으면 성능 크게 올라감** (HotPotQA, ALFWorld 등에서 검증됨)

---

## ReAct 의 강점 (2026 년 관점)

| 강점 | 설명 |
|------|------|
| **환각·오류 전파 크게 감소** | 외부 grounding 으로 사실 기반 응답 |
| **인간처럼 traceable & interpretable** | Thought 가 자연어로 남음 → 의사결정 경로 추적 가능 |
| **동적 계획 조정 가능** | 고정 플랜 없이 실시간 적응 |
| **Tool 사용 + Reasoning 시너지** | 복잡 multi-hop·long-horizon 작업에 강함 |

---

## 약점 & 개선 방향 (현실적)

| 약점 | 개선 방향 |
|------|----------|
| **컨텍스트 길이 폭발** | MCP 처럼 dynamic tool loading + 요약 필요 |
| **불필요한 루프 반복** | Verifier / Reflection 추가 (Reflexion, Self-Refine) |
| **2026 년 트렌드** | ReAct + ReWOO / Plan-and-Execute / Multi-agent 조합 |

---

## 요약

> **ReAct 은 이제 "에이전트 기본 동작 방식"**이라고 해도 과언이 아닙니다.
>
> 생각 (Reasoning) 과 행동 (Acting) 의 번갈아 반복으로 **인간과 유사한 문제 해결 접근**을 가능하게 하는 핵심 패턴입니다.

---

## 감리 관점에서의 시사점

정보시스템 감리 관점에서 ReAct 패턴 도입 시 고려사항:

1. **의사결정 추적성**: Thought 로그의 완전성과 검증 가능성 확인
2. **루프 종료 조건**: 무한 루프 방지를 위한 최대 스텝, 타임아웃 설정 적절성 검토
3. **도구 호출 검증**: Action 호출 전 권한·보안·입력 유효성 검증 프로세스
4. **환각 감소 효과**: ReAct 적용 전후 hallucination 발생률 비교 검증
5. **성능 모니터링**: Thought-Action 반복 횟수, 응답 시간, 토큰 사용량 모니터링
6. **인간 개입 포인트**: 중요 의사결정 시 인간 승인 (Human-in-the-loop) 여부

---

> **참고**: 본 자료는 정보시스템 감리 업무 수행 시 ReAct 패턴 검토를 위한 참고 자료입니다.
