# AI 주도 개발 (AI-DLC) 의 핵심: Bolt 와 Mob 세션

AI 주도 개발 (AI-DLC) 에서의 핵심 개념인 **Bolt**와 **Mob 세션** (Mob Elaboration, Mob Construction 등) 은 전통 Agile/Scrum 의 스프린트·스탠드업을 대체하는 **초고속·협업 중심의 새로운 리추얼 **(ritual)입니다.

이 개념들은 2025~2026 년 실무에서 가장 많이 언급되는 **AI-native 개발의 핵심 빌딩 블록**이에요.

---

## 1. Bolt 란? (Bolt = 초단기 구현 사이클)

| | |
|---|---|
| **전통** | Sprint (2~4 주 단위, 계획·실행·회고 반복) |
| **AI-DLC** | Bolt (수 시간 ~ 며칠 단위, 매우 짧은 반복 사이클) |

### Bolt 의 정의와 특징

- **AI 가 주도적으로 한 번의 집중 작업 단위를 끝내는 "번개처럼 빠른 구현 주기"** (Bolt = 번개라는 의미처럼 빠름)
- **Inception 단계에서 나온 Unit**(작업 단위)
- 보통 **몇 시간 ~ 1~2 일 안에 완료 목표** (전통 스프린트의 1/10~1/20 수준)
- **여러 Bolt 를 병렬/순차로 쌓아 전체 기능을 완성** (Bolt 1 → Bolt 2 → Bolt n)

### 왜 Bolt 인가?

- AI 가 코드·테스트·리팩토링을 **60~90% 자동 생성**하므로, 긴 스프린트가 불필요
- **실패 비용이 낮아** → 빠르게 실험·피드백·수정 가능

### 실무 예시

> "로그인 기능" Unit →  
> **Bolt 1**: 인증 로직 구현 (4 시간) →  
> **Bolt 2**: MFA 추가 + 테스트 (6 시간) →  
> **Bolt 3**: 보안 리뷰 & 배포 (2 시간)

### 실제 표현 예시

- "이 Unit 을 3 개의 Bolt 로 나눠서 진행하자"
- "Bolt 1 완료 후 PR 올려서 CodeRabbit 리뷰 받자"
- "오늘 Bolt 끝내고 Merge → 내일 Bolt 2 시작"

---

## 2. Mob 세션 (Mob Elaboration / Mob Construction)

**Mob** = **Mob Programming 의 확장** (전통 Mob Programming: 팀 전체가 한 화면에서 협업 코딩)

AI-DLC 에서는 **AI 를 팀 멤버로 포함한 실시간 협업 세션**을 의미

- **AI 가 주도적으로 제안·질문·생성**
- **인간 **(팀 전체)

### 주요 Mob 세션 2 가지

| 세션 이름 | 단계 | 지속 시간 | 핵심 활동 | AI 역할 | 인간 역할 | 목적 |
|----------|------|----------|----------|--------|----------|------|
| **Mob Elaboration** | Inception (착수/기획) | 2~4 시간 (반나절) | 고수준 Intent → User Story, Acceptance Criteria, NFR, Risk, Unit 분해 자동 생성 | AI 가 질문 던지며 맥락 정교화 (Plan-Execute 패턴) | 팀 전체 (Mob) 로 답변·검증·우선순위 결정 | Intent 를 검증된 실행 가능한 Units 로 변환 |
| **Mob Construction** | Construction (구축) | Bolt 당 1~8 시간 반복 | Domain Model, 아키텍처, 코드·테스트 자동 생성·리팩토링 | AI 가 multi-file 수정·TDD 생성·제안 | 실시간 리뷰·기술 결정·Gate (Mob 스타일) | Bolt 단위로 완성 가능한 코드·솔루션 산출 |

---

## Mob 세션의 실제 흐름 예시

### Mob Elaboration 예시

1. **PM/PO**: "새로운 결제 시스템을 만들어야 해" (고수준 Intent)
2. **AI** (Claude / Amazon Q / Kiro 등): "결제 수단은 어떤 게 지원되나요? 실패 시 어떻게 처리하나요?" 등 질문 폭탄
3. **팀 전체 **(Mob): 화면 공유 + 실시간 답변 (채팅/음성/코멘트)
4. **AI**: User Story 10 개 + Acceptance Criteria + Risk 목록 + Unit 5 개 자동 생성
5. **팀**: "이 Story 우선순위 바꿔줘", "이 Risk 무시해도 돼" 등 피드백
6. **2~4 시간 만에 Inception 완료** → Bolt 계획으로 넘김

### Mob Construction 예시

1. **Bolt 시작** → AI 가 Domain Model + 코드 초안 생성
2. **팀 Mob 세션**: 화면 공유 + AI 제안 실시간 리뷰
3. "**이 부분 async 로 바꿔", "테스트 3 개 더 추가해**" → AI 즉시 수정
4. **Bolt 끝** → 자동 PR → CodeRabbit 리뷰 → Merge

---

## Bolt + Mob 의 시너지 효과 (2026 년 실무 관찰)

| | |
|---|---|
| **Mob Elaboration** | → Bolt 계획 완성 (Inception 압축) |
| **Mob Construction** | → 각 Bolt 를 고속·고품질로 실행 |
| **결과** | 전통 2 주 스프린트 → 하루~이틀 Bolt 여러 개로 대체 |
| **생산성** | 5~10 배↑ (AWS 고객 실험 100+ 사례 기반) |
| **품질 Gate** | 인간 Mob 이 핵심 부분만 느리게 검토 → AI 가 나머지 커버 |

---

## 요약: 마인드셋 변화

| 과거 | 지금 |
|------|------|
| "2 주 스프린트 계획 세우자" | "**Mob Elaboration 으로 Intent 잡고 → Bolt 단위로 Mob Construction 반복하자**" |
| 인간이 모든 코드 작성 | **AI 가 "운전자 **(Driver) (Mob Programming 확장) |

---

## 감리 관점에서의 시사점

정보시스템 감리 관점에서 Bolt 와 Mob 세션 도입 시 고려사항:

1. **Bolt 산출물 검증**: 각 Bolt 완료 시 코드·테스트·문서의 적절성 검토
2. **Mob 세션 기록 관리**: AI 와의 대화 로그, 의사결정 근거의 추적성 확보
3. **품질 Gate 명확화**: 인간이 검토해야 할 핵심 부분의 기준과 프로세스 정의
4. **생산성 측정**: Bolt 기반 생산성 지표 (Bolt 당 완료 기능, 결함률 등) 모니터링
5. **지식 공유**: Mob 세션을 통한 팀 지식 전수 효과 검증
6. **위험 관리**: 초단기 사이클에서의 보안·컴플라이언스 검토 누락 방지

---

> **참고**: 본 자료는 정보시스템 감리 업무 수행 시 AI-DLC 개발 방법론 검토를 위한 참고 자료입니다.
