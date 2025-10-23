import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, Utensils, Smartphone, Send, Info, Building2, ArrowRight } from "lucide-react";

const cn = (...a) => a.filter(Boolean).join(" ");
const Card = ({ className, children }) => (
  <div className={cn("rounded-2xl shadow-sm border border-gray-200/60 bg-white", className)}>{children}</div>
);
const CardHeader = ({ className, children }) => (
  <div className={cn("p-5 border-b border-gray-100", className)}>{children}</div>
);
const CardContent = ({ className, children }) => (
  <div className={cn("p-5", className)}>{children}</div>
);
const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-gray-50 border-gray-200 text-gray-700">{children}</span>
);
const Button = ({ className, children, ...props }) => (
  <button className={cn(
      "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition active:scale-[.99]",
      "bg-gray-900 text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-300",
      className
    )}
    {...props}
  >{children}</button>
);
const Input = ({ className, ...props }) => (
  <input className={cn("w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200", className)} {...props} />
);
const Select = ({ className, ...props }) => (
  <select className={cn("w-full rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200", className)} {...props} />
);

function useCountdown(targetISO) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(targetISO).getTime() - now.getTime());
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s, finished: diff === 0 };
}

export default function App() {
  const meta = {
    title: "2025 리더십 교육 - 신임 리더 과정",
    dateLabel: "2025년 10월 29일(수)",
    startISO: "2025-10-29T09:30:00+09:00",
    endISO: "2025-10-29T17:30:00+09:00",
    durationLabel: "7시간 (09:30~17:30)",
    placeName: "과천 본사 1층 강의실",
    placeAddress: "경기 과천시 (본사 1층 강의실)",
    lunchPlace: "참우돈가 과천점",
  };

  const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbyO49hordfGjgSvwn8gUQL21tS1vJCLnkmIUhxalI4n4JjjmNqbscnc37EC2zPmW4bYsA/exec";
  const { d, h, m, s } = useCountdown(meta.startISO);
  const [form, setForm] = useState({ name: "", menu: "" });
  const canSubmit = form.name.trim().length > 0 && form.menu;

  async function submitLunch(e) {
    e.preventDefault();
    const payload = { ...form, timestamp: new Date().toISOString() };

    try {
      const res = await fetch(SHEETS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Bad response");
      alert("제출 완료! (Google 시트로 전송되었습니다)");
      localStorage.setItem("leadership_lunch", JSON.stringify(payload));
      setForm({ name: "", menu: "" });
    } catch (err) {
      console.error(err);
      alert("전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  const agenda = [
    { time: "09:00", text: "강의장 오픈 (지각 금지)" },
    { time: "09:30", text: "오리엔테이션" },
    { time: "09:40", text: "M1. 가비아 리더의 마인드 셋" },
    { time: "11:30", text: `점심 (${meta.lunchPlace})` },
    { time: "12:30", text: "M2. 리더의 효율적인 업무 배분" },
    { time: "15:30", text: "M3. 팀원 감정관리와 관계 유지" },
    { time: "17:30", text: "교육 만족도 설문 진행 및 마무리" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <header className="max-w-5xl mx-auto px-6 pt-10 pb-6">
        <div className="flex flex-col gap-6">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          >
            {meta.title}
          </motion.h1>
          <div className="flex flex-wrap items-center gap-3">
            <Badge><CalendarDays className="w-3.5 h-3.5 mr-1" /> {meta.dateLabel}</Badge>
            <Badge><Clock className="w-3.5 h-3.5 mr-1" /> {meta.durationLabel}</Badge>
            <Badge><Building2 className="w-3.5 h-3.5 mr-1" /> {meta.placeName}</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-gray-600"><Clock className="w-4 h-4"/> 시작까지</div>
              <div className="mt-2 text-2xl font-bold">{d}일 {h}시간 {m}분 {s}초</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {agenda.map((a, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-16 shrink-0 font-mono text-sm text-gray-600">{a.time}</div>
                    <div className="flex-1">{a.text}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-base font-semibold"><Info className="w-4 h-4"/> 유의사항</div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
                <li><strong>지각 금지:</strong> 08:50까지 착석 완료 바랍니다.</li>
                <li><strong>장소:</strong> {meta.placeName} ({meta.placeAddress})</li>
                <li><strong>점심:</strong> 사전 메뉴 선택 필요 · 장소: {meta.lunchPlace}</li>
                <li><strong>고용보험 환급:</strong> 아래 안내에 따라 <em>입실 전</em> 앱을 설치하세요.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-base font-semibold"><Info className="w-4 h-4"/> 강사 소개</div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/dtl/author/1000119406.jpg" alt="강사 김철영 소장" className="w-32 h-32 rounded-xl object-cover border" />
                <div className="text-sm leading-relaxed">
                  <p><strong>이름:</strong> 김철영 소장</p>
                  <p><strong>학력:</strong> 고려대 교육대학원 석사 (기업교육 전공)</p>
                  <p><strong>주요 경력:</strong></p>
                  <ul className="list-disc pl-5">
                    <li>엑스퍼트컨설팅 마케팅 실장 (2021)</li>
                    <li>국제 온누리 노무법인 HR컨설팅 실장 (2016)</li>
                    <li>한국GM 인력관리팀 파트장 (2014)</li>
                    <li>버크만 진단 강사 자격</li>
                  </ul>
                  <p className="mt-2"><strong>전문 분야:</strong> 리더십, 스마트 워킹, 조직문화</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 font-semibold"><Utensils className="w-4 h-4"/> 점심 메뉴 선택</div>
              <p className="text-sm text-gray-600">제출 즉시 Google 시트로 저장됩니다. <span className="font-medium">이름은 본명</span>으로 작성해주세요.</p>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={submitLunch}>
                <div>
                  <label className="text-sm font-medium">이름 (본명)</label>
                  <Input placeholder="예: 홍길동" value={form.name} onChange={(e)=>setForm(v=>({...v,name:e.target.value}))}/>
                </div>
                <div>
                  <label className="text-sm font-medium">메뉴</label>
                  <Select value={form.menu} onChange={(e)=>setForm(v=>({...v,menu:e.target.value}))}>
                    <option value="">선택해주세요</option>
                    <option value="한우갈비탕">한우갈비탕</option>
                    <option value="한우생불고기">한우생불고기</option>
                    <option value="한우소고기보신탕">한우소고기보신탕</option>
                    <option value="한우육계장">한우육계장</option>
                    <option value="한우육회비빔밥">한우육회비빔밥</option>
                    <option value="김치찌개">김치찌개</option>
                    <option value="된장찌개">된장찌개</option>
                    <option value="안 먹겠음">안 먹겠음</option>
                  </Select>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={!canSubmit} className={cn(!canSubmit && "opacity-50 cursor-not-allowed")}> 
                    <Send className="w-4 h-4"/> 제출
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 font-semibold"><Smartphone className="w-4 h-4"/> 고용보험 환급 앱 설치 안내</div>
              <p className="text-sm text-gray-600">아래 절차를 반드시 교육 전 완료해 주세요.</p>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed">
                <li>교육 전 미리 <strong>고용노동부 HRD-Net(www.hrd.go.kr)</strong>에 가입 및 개인별 ID를 생성(개인/일반회원)합니다. 이미 생성한 ID가 있을 경우 해당 ID 사용해도 됩니다.</li>
                <li>본인 인증 하시어 회원가입 완료해주세요.</li>
                <li>본인의 스마트폰에 <strong>HRD-Net 훈련생 출결관리</strong> App을 다운로드하여 PC로 가입한 HRD-Net 아이디로 로그인 진행 합니다.</li>
                <li>지정된 훈련장소에 도착하면 자동으로 훈련과정이 목록에서 확인되며 <strong>입실</strong> 버튼을 눌러 출석을 체크하여 주시기 바랍니다.</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-6 pb-14">
        <Card>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm">
              <div className="font-semibold">문의</div>
              <div>인사유닛 Sandy : 02-829-3522</div>
            </div>
            <a href="#" onClick={(e)=>{e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' });}}>
              <Button className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-50">
                맨 위로 <ArrowRight className="w-4 h-4 rotate-180"/>
              </Button>
            </a>
          </CardContent>
        </Card>
      </footer>
    </div>
  );
}
