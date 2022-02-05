# JWorld-Metaverse

- 메타버스 SNS 클라이언트사이드 만들기
- 싸이월드 모티브
- 현재는 Oracle Cloud Free Tier를 사용하여 서버 성능 부족으로 이용 불가한 상태입니다

## 주요 기능

### 공통

- 실시간 채팅
- 로그인 / 회원 가입
- 동영상 / 이미지 업로드

### Worlds

- 실시간 로비 (게임 로비 형태)
- 월드 만들기 (월드 이름, 최대 입장 가능 수 조절)
- 3D 캐릭터 조작
- 실시간 캐릭터 움직임 연동
- 충돌 처리
- 영상 스트리밍 (Preparing...)


### Rooms

- 방 만들기 / 방 저장하기
- 3d 모델 설치, 이동 / 크기 조절 / 회전 조절 / 개수 조절 / 수정 / 제거
- 내가 꾸민 방 타 유저에게 공개됨 (게시판 형태)
- 유저가 업로드한 동영상 / 이미지를 각각 tv 모델, 액자 모델에 전시
- 기타 3d 모델들의 인터랙션

## 초기 출시 (2022.01)

- 공통

- [x] 로그인 & 회원가입
- [ ] 비밀번호 찾기

- 스트림 월드 로비

- [x] 전체 채팅
- [x] 로비룸 구현
- [x] 실시간 연동

- 스트림 월드

- [ ] 비디오 텍스처 적용
- [ ] 스트리밍 방송 or 영상 송출 기능 적용
- [ ] 축구공 멀티플레이 시범 연동

- 아바타

- [x] 아바타 조작 
- [x] 장애물 넘어가지 않게 물리엔진 적용
- [x] 아바타 실시간 연동

- 미니홈피 (개인 3D룸)

- [x] 방 크기 커스텀 기능
- [x] 3D 오브젝트 (가구) 적용 & 커스텀 배치 기능 (회전, 크기, 위치 지정)
- [x] 특정 오브젝트 여러개 생성 가능하게 하기
- [x] 미니홈피 저장
- [x] 액자에 이미지 등록
- [ ] 방명록 작성 (책 3d 오브젝트 + CSS3D)
- [x] 미니홈피 TV에 영상 목록 커스텀 기능 등록
- [x] 미니홈피 TV에 비디오 텍스처 입히기
- [x] 액자 생성 기능
- [x] 미니홈피 로비 페이지 구현 

## 1차 대규모 업데이트

- 공통

- [ ] 파티 생성 & 그룹 채팅 기능
- [ ] 그룹 음성채팅 생성
- [ ] 귓속말 채팅
- [ ] 소셜 로그인
- [ ] 회원 탈퇴
- [ ] 친구맺기

- 미니홈피

- [ ] 벽 생성 기능
- [x] 모든 동일 모델 중복 생성 기능 (개수 제한 필요)
- [ ] 미니홈피에 아바타 입장 가능
- [ ] VR 모드 추가
- [ ] 배경음 등록 & 설정

- 스트림 월드

- [ ] N:N 비디오 / 오디오 채팅


- 축구장

- [ ] 축구장 생성 기능
- [ ] 최대인원 설정 기능 (2-22명)
- [ ] 공 연동
- [ ] 스코어 기능

- 피아노

- [ ] 3D 모델

## 2차 대규모 업데이트 (부분 유료화 - 수익 모델)

- 아바타

- [ ] 아이템 추가
- [ ] 아바타 커스텀 기능
- [ ] 아바타 기본 아이템 + 여분 아이템 적용

- 스트림 월드

- [ ] 영상 처리 (Pose Estimation)을 이용한 아바타 움직임 적용

- 미니홈피

- [ ] 3D 오브젝트(가구) 추가
- [ ] 미니홈피 추천 기능 추가


- 화폐 시스템

- [ ] 게임머니 적용
- [ ] 미니홈피 추천 받은 수에 따른 화폐 지급
- [ ] 미니게임 (축구 등) 승리 시 화폐 지급
- [ ] 캐쉬로 게임머니 구매 시스템 적용 (부분 유료화)
- [ ] 결제 시스템 도입

- 상점 시스템

- [ ] 아이템 구매 기능
- [ ] 가구 구매 기능

### 클라이언트사이드 기술스택

- [x] Next.js
- [x] TypeScript
- [x] Three.js (React-Three-Fiber)
- [x] Cannon.js
- [x] Tailwind CSS
- [x] Styled-Components - (기존에 만들어놓은 컴포넌트 활용 위함)
- [x] GraphQL
- [x] GraphQL-Apollo - (전역 상태관리, GRAPHQL API 요청)
- [x] Axios (REST-API) - (파일 전송 용이하게 하기 위함)
- [x] Websocket
- [ ] WebRTC
- [x] Docker

### 기획 Figma

- https://www.figma.com/file/8HQy4JpmEwmkXsWAR53sbF/Untitled?node-id=24%3A15
