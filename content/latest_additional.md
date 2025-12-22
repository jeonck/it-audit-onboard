# 기타 기술적 점검 방법

감리 대상 시스템의 기술적 검증을 보완하기 위해 아래의 추가적인 기술적 점검 방법을 참고하시기 바랍니다.

### 1. 클라우드 네이티브 (쿠버네티스 중심)

인프라의 상태를 명령어로 직접 확인하여 설계서와 일치하는지 검증합니다.

**오토스케일링(HPA) 설정 확인**
- **명령어**: `kubectl get hpa -n [네임스페이스]`
- **점검 내용**: 최소/최대 Pod 수, CPU/Memory 임계치 설정이 설계와 일치하는지 확인.

**리소스 할당(Quota) 제한 확인**
- **명령어**: `kubectl describe quota -n [네임스페이스]`
- **점검 내용**: 특정 서비스가 전체 자원을 독점하지 않도록 limits와 requests가 설정되었는지 확인.

**서비스 메쉬(Istio 등) 서킷 브레이커 확인**
- **방법**: `istioctl proxy-config endpoint [포드명]` 명령으로 비정상 서비스 차단 설정(Outlier Detection) 확인.

### 2. 인공지능 (AI 모델 성능 및 자원)

모델의 실제 구동 상태와 결과의 신뢰도를 기술적으로 검증합니다.

**GPU 점유율 및 가용량 확인**
- **명령어**: `nvidia-smi`
- **점검 내용**: 추론(Inference) 시 GPU 메모리 누수가 없는지, 메모리 점유율이 적정한지 확인.

**API 응답 로그 분석**
- **방법**: ELK 스택이나 클라우드 로그(CloudWatch 등)에서 응답 시간(Latency) 쿼리 수행.
- **쿼리 예시**: `filter @message like /request_time/ | stats avg(request_time) by bin(1m)`

**RAG(검색증강생성) 참조 출처 확인**
- **방법**: AI 답변 시 하단에 실제 DB/문서의 근거(Source Citation)가 링크되거나 로그에 남는지 확인.

### 3. DB 통합 및 이관 (SQL 검증)

데이터 유실을 막기 위해 'Count'와 'Hash' 값을 비교하는 것이 정석입니다.

**데이터 정합성 전수 검정 (CheckSum)**
- **SQL 예시**:
  ```sql
  -- Oracle/PostgreSQL 예시
  SELECT COUNT(*), SUM(PAY_AMT), BIT_XOR(USER_ID) FROM TABLE_NAME;
  ```
- **점검 내용**: 원천(AS-IS)과 타겟(TO-BE) DB에서 동일 쿼리를 실행하여 값이 1원이라도 틀린지 확인.

**인덱스 및 실행계획(Explain Plan) 확인**
- **명령어**: `EXPLAIN ANALYZE SELECT ...`
- **점검 내용**: 이관 후 Full Table Scan이 발생하는지, 인덱스가 적절히 생성되어 성능을 보장하는지 확인.

### 4. 민간 클라우드/SaaS (보안 및 연계)

외부망 연계 시 보안 설정과 데이터 암호화를 기술적으로 점검합니다.

**TLS 암호화 통신 확인**
- **명령어**: `openssl s_client -connect [도메인]:443`
- **점검 내용**: 최신 보안 프로콜인 TLS 1.2 또는 1.3만 허용되는지, 취약한 암호화 알고리즘은 차단되었는지 확인.

**API 인증 토큰 보안**
- **방법**: 호출 시 JWT(JSON Web Token) 등 인증 토큰의 만료 시간(Exp)이 짧게 설정되어 있는지 디코딩하여 확인.

**망 분리 접속 로그**
- **방법**: 클라우드 콘솔의 Flow Log 또는 CloudTrail을 조회하여 비인가 IP의 접근 시도가 차단(Deny)되었는지 로그 확인.