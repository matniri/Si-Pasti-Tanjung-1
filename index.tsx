import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, BrainCircuit, Lock, Unlock, LogIn, LogOut, PlusCircle, History, 
  HelpCircle, FileText, Download, Printer, Copy, Save, Edit3, Trash2, RefreshCw, 
  CheckCircle2, AlertCircle, ChevronRight, User, Calendar, Award, Sparkles, 
  Layers, School, Check, FileCheck, Eye, EyeOff, Search, Settings, ArrowLeft
} from 'lucide-react';

// Logo Resmi UPTD SDN DHARMA TANJUNG 1 (Base64 dari gambar logo)
const SCHOOL_LOGO_URL = "https://i.ibb.co/L8rM0Pz/Logo-Tanjung-1-2.jpg"; // Fallback URL / SVG pendukung, kita gunakan SVG rekonstruksi logo presisi

// Custom SVG Logo berdasarkan Gambar Asli SDN DHARMA TANJUNG 1
const SchoolLogoComponent = ({ className = "w-10 h-10" }) => (
  <div className={`relative flex items-center justify-center overflow-hidden rounded-full border border-orange-500/30 bg-black ${className}`}>
    <svg viewBox="0 0 500 500" className="w-full h-full object-contain">
      <rect width="500" height="500" fill="#000000" />
      {/* Sun rays fan */}
      <g stroke="#ff8c00" strokeWidth="2">
        <path d="M 250,330 L 70,220 A 200,200 0 0 1 430,220 Z" fill="url(#sunGrad)" />
      </g>
      <defs>
        <linearGradient id="sunGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ff4500" />
          <stop offset="50%" stopColor="#ffa500" />
          <stop offset="100%" stopColor="#ffd700" />
        </linearGradient>
        <linearGradient id="bookGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4169e1" />
          <stop offset="100%" stopColor="#00008b" />
        </linearGradient>
      </defs>
      {/* Star at top */}
      <polygon points="250,45 256,62 274,62 260,73 265,90 250,80 235,90 240,73 226,62 244,62" fill="#ffd700" />
      {/* Pen nib in center */}
      <path d="M 246,65 L 254,65 L 253,300 L 247,300 Z" fill="#006400" />
      <polygon points="250,55 244,75 256,75" fill="#ffd700" />
      {/* Open book */}
      <path d="M 80,310 Q 250,290 250,330 Q 250,290 420,310 L 410,340 Q 250,320 250,355 Q 250,320 90,340 Z" fill="url(#bookGrad)" />
      {/* Text */}
      <text x="250" y="390" textAnchor="middle" fill="#2b55d5" fontSize="32" fontFamily="sans-serif" fontWeight="900" letterSpacing="1">DHARMA TANJUNG 1</text>
      <text x="250" y="420" textAnchor="middle" fill="#888888" fontSize="16" fontFamily="sans-serif">UPTD SEKOLAH DASAR NEGERI</text>
      <text x="250" y="442" textAnchor="middle" fill="#888888" fontSize="16" fontFamily="sans-serif">KEC. CAMPLONG - SAMPANG</text>
    </svg>
  </div>
);

const CORRECT_PIN = "tanjung1";

const SUBJECTS = [
  "Matematika",
  "Pendidikan Pancasila",
  "Bahasa Indonesia",
  "IPAS",
  "Seni Budaya",
  "Bahasa Madura",
  "PJOK",
  "Bahasa Inggris",
  "Pendidikan Agama Islam",
  "Koding dan Kecerdasan Artifisial (KKA)"
];

const QUESTION_TYPES = [
  { id: 'pg', label: 'Pilihan Ganda', desc: '1 jawaban benar (A, B, C, D)' },
  { id: 'pg_kompleks', label: 'Pilihan Ganda Kompleks', desc: 'Dapat memilih >1 jawaban benar' },
  { id: 'bs', label: 'Benar / Salah', desc: 'Pernyataan benar atau salah' },
  { id: 'jodoh', label: 'Menjodohkan', desc: 'Pencocokan lajur kiri & kanan' },
  { id: 'isian', label: 'Isian Singkat', desc: 'Jawaban isian singkat' },
  { id: 'uraian', label: 'Uraian / Essay', desc: 'Jawaban penjelasan/langkah' },
  { id: 'hots', label: 'Soal HOTS', desc: 'Penalaran & Analisis tinggi' }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Navigation State: 'dashboard' | 'form' | 'result' | 'history' | 'guide'
  const [currentView, setCurrentView] = useState('dashboard');

  // Form State
  const [teacherName, setTeacherName] = useState("AGUS SANTOSO, M.Pd.");
  const [selectedClass, setSelectedClass] = useState("Kelas 4");
  const [phase, setPhase] = useState("Fase B");
  const [semester, setSemester] = useState("Semester Ganjil");
  const [subject, setSubject] = useState("Matematika");
  const [assessmentType, setAssessmentType] = useState("Penilaian Harian");
  const [difficulty, setDifficulty] = useState("Sedang");
  const [topic, setTopic] = useState("Pecahan dan Operasi Hitung");
  const [learningObjectives, setLearningObjectives] = useState("Siswa mampu membandingkan dan mengurutkan antar-pecahan serta menyelesaikan masalah sehari-hari berkaitan pecahan.");
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedTypes, setSelectedTypes] = useState(['pg', 'isian', 'uraian']);
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [assessmentDate, setAssessmentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [additionalInstructions, setAdditionalInstructions] = useState("Gunakan konteks kehidupan sehari-hari siswa di daerah pesisir/pedesaan Sampang, Madura.");
  const [userApiKey, setUserApiKey] = useState("");

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState("");
  const [generatedAssessment, setGeneratedAssessment] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [historySearch, setHistorySearch] = useState("");
  const [notification, setNotification] = useState(null);

  // Auto detect Phase when Class changes
  useEffect(() => {
    if (selectedClass.includes("1") || selectedClass.includes("2")) {
      setPhase("Fase A");
    } else if (selectedClass.includes("3") || selectedClass.includes("4")) {
      setPhase("Fase B");
    } else if (selectedClass.includes("5") || selectedClass.includes("6")) {
      setPhase("Fase C");
    }
  }, [selectedClass]);

  // Load History from Local Storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sipasti_history");
      if (saved) {
        setHistoryList(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Gagal memuat riwayat", e);
    }
  }, []);

  const showToast = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === CORRECT_PIN) {
      setIsAuthenticated(true);
      setLoginError("");
      showToast("Selamat Datang di SI PASTI UPTD SDN DHARMA TANJUNG 1!");
    } else {
      setLoginError("PIN yang Anda masukkan salah. Silakan coba kembali.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput("");
    setCurrentView('dashboard');
  };

  const formatDateIndonesian = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleTypeToggle = (typeId) => {
    if (selectedTypes.includes(typeId)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter(t => t !== typeId));
      } else {
        showToast("Pilih minimal satu bentuk soal!", "error");
      }
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const generateAssessmentAI = async () => {
    if (!topic.trim()) {
      showToast("Materi / Ruang Lingkup harus diisi!", "error");
      return;
    }
    if (!learningObjectives.trim()) {
      showToast("Tujuan Pembelajaran harus diisi!", "error");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress("Menghubungkan ke AI Engine Gemini...");

    const formattedTypes = selectedTypes.map(t => {
      const found = QUESTION_TYPES.find(q => q.id === t);
      return found ? found.label : t;
    }).join(", ");

    const systemInstruction = `Anda adalah asisten ahli penyusunan asesmen pendidikan sekolah dasar (SD) di Indonesia yang mengacu pada Kurikulum Merdeka.
Buatlah instrumen soal asesmen lengkap berbasis JSON yang terstruktur presisi berdasarkan data berikut:
- Sekolah: UPTD SDN DHARMA TANJUNG 1
- Guru: ${teacherName}
- Mata Pelajaran: ${subject}
- Kelas / Fase: ${selectedClass} (${phase})
- Semester: ${semester}
- Jenis Asesmen: ${assessmentType}
- Tingkat Kesulitan: ${difficulty}
- Materi Utama: ${topic}
- Tujuan Pembelajaran: ${learningObjectives}
- Jumlah Total Soal: ${questionCount}
- Bentuk Soal Ditargetkan: ${formattedTypes}
- Instruksi Tambahan: ${additionalInstructions}

PETUNJUK SANGAT PENTING:
1. Kembalikan HASIL HANYA DALAM FORMAT JSON VALID tanpa markdown pembungkus tambahan jika memungkinkan.
2. Struktur JSON harus persis seperti skema berikut:
{
  "title": "LEMBAR ASESMEN SD",
  "questions": [
    {
      "id": 1,
      "type": "pg", // Jenis: "pg", "pg_kompleks", "bs", "jodoh", "isian", "uraian", "hots"
      "typeLabel": "Pilihan Ganda",
      "question": "Teks pertanyaan lengkap...",
      "options": ["A. pilihan 1", "B. pilihan 2", "C. pilihan 3", "D. pilihan 4"], // Opsional jika jenis pg / pg_kompleks
      "matchingPairs": [{"left": "Pernyataan A", "right": "Pasangan 1"}], // Khusus jenis "jodoh"
      "answer": "A. pilihan 1", // Kunci Jawaban Singkat
      "explanation": "Pembahasan penjelasan ringkas...",
      "indicator": "Mengidentifikasi pecahan senilai",
      "cognitiveLevel": "L2 / C3 (Aplikasi)"
    }
  ],
  "scoringRubric": {
    "pgWeight": 1,
    "isianWeight": 2,
    "uraianWeight": 3,
    "maxScore": 100,
    "formula": "Nilai Akhir = (Total Skor Perolehan / Skor Maksimum) x 100"
  }
}
3. Pastikan urutan soal rapi: Pilihan Ganda dahulu, lalu Isian, Uraian/HOTS, dsb.
4. Jangan pernah gunakan klaim palsu. Gunakan Bahasa Indonesia yang ramah anak SD.`;

    try {
      setGenerationProgress("Menyusun kisi-kisi, kunci jawaban, dan lembar soal...");
      
      const userQuery = `Buatkan ${questionCount} soal untuk mata pelajaran ${subject} kelas ${selectedClass} (${phase}) materi ${topic}. Susun secara terstruktur dalam format JSON.`;

      const apiKey = userApiKey.trim() !== "" ? userApiKey.trim() : "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          responseMimeType: "application/json"
        }
      };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Gagal menghubungi server AI (${res.status})`);
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("Respon AI tidak valid atau kosong.");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(rawText);
      } catch (jsonErr) {
        console.warn("Manual parsing json cleanup needed", rawText);
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      // Build full assessment object
      const fullAssessment = {
        id: "SOAL-" + Date.now(),
        createdAt: new Date().toISOString(),
        metadata: {
          school: "UPTD SDN DHARMA TANJUNG 1",
          teacher: teacherName,
          subject,
          classGrade: selectedClass,
          phase,
          semester,
          assessmentType,
          difficulty,
          topic,
          learningObjectives,
          academicYear,
          assessmentDate,
          formattedDate: formatDateIndonesian(assessmentDate),
          principal: {
            name: "ACH. RISQI BASUKI, S.Pd.M.Si",
            nip: "196704241988031008"
          }
        },
        questions: parsedData.questions || [],
        scoringRubric: parsedData.scoringRubric || {
          pgWeight: 1,
          isianWeight: 2,
          uraianWeight: 3,
          maxScore: 100,
          formula: "Nilai Akhir = (Skor Perolehan / Skor Max) x 100"
        }
      };

      setGeneratedAssessment(fullAssessment);
      saveToHistory(fullAssessment);
      setIsGenerating(false);
      setCurrentView('result');
      showToast("Berhasil menyusun soal dengan AI!");

    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      showToast("Gagal membuat soal: " + error.message, "error");
    }
  };

  const saveToHistory = (item) => {
    try {
      const existing = [...historyList];
      const index = existing.findIndex(h => h.id === item.id);
      if (index >= 0) {
        existing[index] = item;
      } else {
        existing.unshift(item);
      }
      setHistoryList(existing);
      localStorage.setItem("sipasti_history", JSON.stringify(existing));
    } catch (e) {
      console.error("Gagal menyimpan ke riwayat local", e);
    }
  };

  const deleteHistoryItem = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus soal ini dari riwayat?")) {
      const updated = historyList.filter(item => item.id !== id);
      setHistoryList(updated);
      localStorage.setItem("sipasti_history", JSON.stringify(updated));
      showToast("Riwayat soal telah dihapus.");
    }
  };

  const handleUpdateQuestion = (index, field, value) => {
    if (!generatedAssessment) return;
    const updatedQs = [...generatedAssessment.questions];
    updatedQs[index] = { ...updatedQs[index], [field]: value };
    
    const updated = {
      ...generatedAssessment,
      questions: updatedQs
    };
    setGeneratedAssessment(updated);
    saveToHistory(updated);
  };

  const handleDeleteQuestion = (index) => {
    if (!generatedAssessment) return;
    if (generatedAssessment.questions.length <= 1) {
      showToast("Minimal harus ada 1 soal!", "error");
      return;
    }
    const updatedQs = generatedAssessment.questions.filter((_, i) => i !== index);
    const renumbered = updatedQs.map((q, idx) => ({ ...q, id: idx + 1 }));
    const updated = {
      ...generatedAssessment,
      questions: renumbered
    };
    setGeneratedAssessment(updated);
    saveToHistory(updated);
    showToast("Soal berhasil dihapus.");
  };

  const handleAddQuestion = () => {
    if (!generatedAssessment) return;
    const newId = generatedAssessment.questions.length + 1;
    const newQuestion = {
      id: newId,
      type: 'pg',
      typeLabel: 'Pilihan Ganda',
      question: 'Tuliskan pertanyaan baru di sini...',
      options: ['A. Opsi A', 'B. Opsi B', 'C. Opsi C', 'D. Opsi D'],
      answer: 'A. Opsi A',
      explanation: 'Tuliskan penjelasan pembahasan di sini...',
      indicator: 'Indikator baru',
      cognitiveLevel: 'L1 / C2'
    };
    const updated = {
      ...generatedAssessment,
      questions: [...generatedAssessment.questions, newQuestion]
    };
    setGeneratedAssessment(updated);
    saveToHistory(updated);
    showToast("Soal baru berhasil ditambahkan!");
  };

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = () => {
    if (!generatedAssessment) return;
    let textStr = `=== ${generatedAssessment.metadata.school} ===\n`;
    textStr += `MATA PELAJARAN: ${generatedAssessment.metadata.subject}\n`;
    textStr += `KELAS / SEMESTER: ${generatedAssessment.metadata.classGrade} / ${generatedAssessment.metadata.semester}\n`;
    textStr += `MATERI: ${generatedAssessment.metadata.topic}\n\n`;
    textStr += `--- SOAL SISWA ---\n\n`;

    generatedAssessment.questions.forEach((q, idx) => {
      textStr += `${idx + 1}. ${q.question}\n`;
      if (q.options && q.options.length > 0) {
        q.options.forEach(opt => {
          textStr += `   ${opt}\n`;
        });
      }
      textStr += `\n`;
    });

    textStr += `\n--- KUNCI JAWABAN ---\n\n`;
    generatedAssessment.questions.forEach((q, idx) => {
      textStr += `${idx + 1}. Jawaban: ${q.answer}\n`;
      if (q.explanation) textStr += `   Pembahasan: ${q.explanation}\n`;
    });

    navigator.clipboard.writeText(textStr);
    showToast("Seluruh soal dan kunci jawaban disalin ke clipboard!");
  };

  const downloadWordDoc = () => {
    if (!generatedAssessment) return;
    const meta = generatedAssessment.metadata;
    let htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Naskah Soal ${meta.subject}</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.5; margin: 20px; }
        .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header h2, .header h3 { margin: 2px; }
        .meta-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
        .meta-table td { padding: 4px; vertical-align: top; }
        .question-box { margin-bottom: 15px; }
        .options { margin-left: 20px; }
        .page-break { page-break-before: always; }
        table.kisi { width: 100%; border-collapse: collapse; margin-top: 15px; }
        table.kisi th, table.kisi td { border: 1px solid #000; padding: 6px; font-size: 12px; }
      </style>
      </head>
      <body>
        <div class="header">
          <h3>PEMERINTAH KABUPATEN SAMPANG</h3>
          <h2>DINAS PENDIDIKAN</h2>
          <h2>UPTD SDN DHARMA TANJUNG 1</h2>
          <p>Kecamatan Camplong - Kabupaten Sampang</p>
        </div>

        <h3 style="text-align:center; text-transform:uppercase;">NASKAH ASESMEN ${meta.assessmentType.toUpperCase()}</h3>
        <table class="meta-table">
          <tr>
            <td width="18%">Mata Pelajaran</td><td width="2%">:</td><td width="30%">${meta.subject}</td>
            <td width="18%">Hari / Tanggal</td><td width="2%">:</td><td width="30%">${meta.formattedDate}</td>
          </tr>
          <tr>
            <td>Kelas / Fase</td><td>:</td><td>${meta.classGrade} (${meta.phase})</td>
            <td>Tahun Pelajaran</td><td>:</td><td>${meta.academicYear}</td>
          </tr>
          <tr>
            <td>Materi Utama</td><td>:</td><td colspan="4">${meta.topic}</td>
          </tr>
        </table>

        <h4>I. SOAL ASESMEN</h4>
    `;

    generatedAssessment.questions.forEach((q, idx) => {
      htmlContent += `
        <div class="question-box">
          <p><b>${idx + 1}.</b> ${q.question}</p>
      `;
      if (q.options && q.options.length > 0) {
        htmlContent += `<div class="options">`;
        q.options.forEach(opt => {
          htmlContent += `<p style="margin: 2px 0;">${opt}</p>`;
        });
        htmlContent += `</div>`;
      }
      if (q.type === 'jodoh' && q.matchingPairs) {
        htmlContent += `<table border="1" style="border-collapse:collapse; margin-top:5px;"><tr><th>Pernyataan</th><th>Pasangan</th></tr>`;
        q.matchingPairs.forEach(p => {
          htmlContent += `<tr><td>${p.left}</td><td>${p.right}</td></tr>`;
        });
        htmlContent += `</table>`;
      }
      htmlContent += `</div>`;
    });

    // Signature
    htmlContent += `
      <br/><br/>
      <table width="100%">
        <tr>
          <td width="50%" text-align="center">
            Mengetahui,<br/>Kepala Sekolah UPTD SDN Dharma Tanjung 1<br/><br/><br/><br/>
            <b><u>${meta.principal.name}</u></b><br/>NIP. ${meta.principal.nip}
          </td>
          <td width="50%" text-align="center">
            Sampang, ${meta.formattedDate}<br/>Guru Kelas / Mata Pelajaran<br/><br/><br/><br/>
            <b><u>${meta.teacher}</u></b>
          </td>
        </tr>
      </table>

      <div class="page-break"></div>
      <h3>KUNCI JAWABAN & PEDOMAN PENSKORAN</h3>
      <table border="1" style="width:100%; border-collapse:collapse;">
        <tr><th width="8%">No</th><th>Kunci Jawaban</th><th>Pembahasan</th></tr>
    `;

    generatedAssessment.questions.forEach((q, idx) => {
      htmlContent += `
        <tr>
          <td align="center">${idx + 1}</td>
          <td>${q.answer}</td>
          <td>${q.explanation || '-'}</td>
        </tr>
      `;
    });

    htmlContent += `
      </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Soal_${meta.subject}_${meta.classGrade.replace(' ', '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("Dokumen Word (.doc) berhasil diunduh!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full border border-orange-500/30">
          {/* Header Banner - Black & Orange Gradient */}
          <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-6 text-center text-white relative">
            <div className="flex justify-center mb-3">
              <SchoolLogoComponent className="w-20 h-20 shadow-xl border-2 border-white rounded-full" />
            </div>
            <h1 className="text-2xl font-black tracking-wide text-white">SI PASTI</h1>
            <p className="text-orange-100 text-xs mt-1 uppercase font-semibold tracking-wider">
              Aplikasi Pembuat Soal Otomatis SD
            </p>
            <div className="mt-3 inline-flex items-center gap-2 bg-black/60 text-orange-200 text-xs px-3 py-1.5 rounded-full border border-orange-400/40">
              <School className="w-3.5 h-3.5 text-orange-400" />
              <span className="font-semibold">UPTD SDN DHARMA TANJUNG 1</span>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleLogin} className="p-6 space-y-5 bg-white">
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
                Masukkan PIN Akses Guru
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5 text-orange-500" />
                </div>
                <input
                  type={showPin ? "text" : "password"}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan PIN rahasia..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition text-slate-800 font-semibold"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-orange-600 transition"
                  title={showPin ? "Sembunyikan PIN" : "Tampilkan PIN"}
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition duration-200 flex items-center justify-center gap-2 group"
            >
              <span>MASUK APLIKASI</span>
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer Info */}
          <div className="bg-slate-900 px-6 py-4 border-t border-slate-800 text-center text-xs text-slate-300">
            Sistem Cerdas Penyusunan Asesmen & Cerdas Belajar © 2026
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-sm font-medium transition-all transform animate-bounce ${
          notification.type === 'error' ? 'bg-rose-600 text-white border-rose-700' : 'bg-orange-600 text-white border-orange-700'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header Bar - Black & Orange Accent */}
      <header className="bg-black text-white shadow-md print:hidden border-b-2 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <SchoolLogoComponent className="w-10 h-10 border border-orange-400 rounded-full" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight leading-none text-white">SI PASTI</h1>
                <span className="bg-orange-500 text-black text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-orange-400">AI SD</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">UPTD SDN DHARMA TANJUNG 1</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentView === 'dashboard' ? 'bg-orange-500 text-black shadow font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentView('form')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentView === 'form' ? 'bg-orange-500 text-black shadow font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Soal</span>
            </button>

            <button
              onClick={() => setCurrentView('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentView === 'history' ? 'bg-orange-500 text-black shadow font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Riwayat</span>
            </button>

            <button
              onClick={() => setCurrentView('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentView === 'guide' ? 'bg-orange-500 text-black shadow font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Panduan</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Body Dynamic Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* ==================== 1. DASHBOARD VIEW ==================== */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero Card */}
            <div className="bg-gradient-to-br from-black via-slate-900 to-orange-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-orange-500/30">
              <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                <BrainCircuit className="w-96 h-96 text-orange-500" />
              </div>
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-orange-500 text-black text-xs font-extrabold px-3 py-1 rounded-full mb-3 shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>KECERDASAN BUATAN KHUSUS GURU SD</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white">
                  AI PEMBUAT SOAL OTOMATIS
                </h2>
                <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
                  Selamat datang di <b className="text-orange-400">SI PASTI</b>, platform penyusun asesmen otomatis untuk guru UPTD SDN DHARMA TANJUNG 1. Hemat waktu menyusun Kisi-kisi, Lembar Soal, Kunci Jawaban, dan Rubrik Penskoran berstandar Kurikulum Merdeka.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setCurrentView('form')}
                    className="bg-orange-500 hover:bg-orange-400 text-black font-extrabold px-5 py-3 rounded-xl shadow-lg transition flex items-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>BUAT SOAL BARU SEKARANG</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('history')}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-xl border border-white/20 transition flex items-center gap-2"
                  >
                    <History className="w-5 h-5" />
                    <span>LIHAT RIWAYAT</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Menu Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={() => setCurrentView('form')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-400 transition cursor-pointer group"
              >
                <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Buat Soal AI</h3>
                <p className="text-slate-500 text-xs">Formulir lengkap Kurikulum Merdeka dengan 10 mata pelajaran SD.</p>
              </div>

              <div 
                onClick={() => setCurrentView('history')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-400 transition cursor-pointer group"
              >
                <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center text-amber-700 mb-4 group-hover:scale-110 transition-transform">
                  <History className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Riwayat Asesmen</h3>
                <p className="text-slate-500 text-xs">Buka kembali, edit, dan unduh soal-soal yang pernah dibuat.</p>
              </div>

              <div 
                onClick={() => setCurrentView('guide')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-400 transition cursor-pointer group"
              >
                <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center text-slate-800 mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Panduan Penggunaan</h3>
                <p className="text-slate-500 text-xs">Petunjuk penyusunan HOTS, kisi-kisi, dan tips ekspor dokumen.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
                <SchoolLogoComponent className="w-12 h-12 shrink-0 rounded-full border border-orange-500" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Identitas Sekolah</h3>
                  <p className="text-orange-600 font-extrabold text-xs mt-0.5">UPTD SDN DHARMA TANJUNG 1</p>
                  <p className="text-slate-500 text-[11px]">Kec. Camplong, Kab. Sampang</p>
                </div>
              </div>
            </div>

            {/* API Key Settings */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-600" />
                <span>Pengaturan Kunci API Gemini (Opsional)</span>
              </h3>
              <p className="text-xs text-slate-600 mb-3">
                Aplikasi ini dilengkapi dengan API otomatis. Jika Anda ingin menggunakan API Key pribadi dari Google AI Studio, masukkan di bawah ini:
              </p>
              <div className="flex gap-2 max-w-xl">
                <input
                  type="password"
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                  placeholder="Masukkan Gemini API Key pribadi (opsional)..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-orange-500"
                />
                <button
                  onClick={() => showToast("API Key tersimpan!")}
                  className="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. FORM VIEW ==================== */}
        {currentView === 'form' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-black via-slate-900 to-orange-950 p-6 text-white border-b-2 border-orange-500">
              <h2 className="text-xl font-extrabold flex items-center gap-2 text-white">
                <Sparkles className="w-6 h-6 text-orange-400" />
                <span>Formulir Pengaturan Pembuatan Soal AI</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Lengkapi parameter di bawah untuk menghasilkan soal presisi dan selaras indikator Kurikulum Merdeka.
              </p>
            </div>

            <div className="p-6 space-y-6">
              
              {/* SECTION 1: Identitas Guru & Kelas */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-600" />
                  <span>1. Identitas & Kelas Target</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Guru Pembuat</label>
                    <input
                      type="text"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kelas</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    >
                      <option value="Kelas 1">Kelas 1</option>
                      <option value="Kelas 2">Kelas 2</option>
                      <option value="Kelas 3">Kelas 3</option>
                      <option value="Kelas 4">Kelas 4</option>
                      <option value="Kelas 5">Kelas 5</option>
                      <option value="Kelas 6">Kelas 6</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fase (Otomatis)</label>
                    <input
                      type="text"
                      value={phase}
                      readOnly
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-600 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    >
                      <option value="Semester Ganjil">Semester Ganjil</option>
                      <option value="Semester Genap">Semester Genap</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Pelajaran</label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Asesmen</label>
                    <input
                      type="date"
                      value={assessmentDate}
                      onChange={(e) => setAssessmentDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Mata Pelajaran & Karakteristik Asesmen */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>2. Mata Pelajaran & Karakteristik Asesmen</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none font-medium"
                    >
                      {SUBJECTS.map((sub, idx) => (
                        <option key={idx} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Asesmen</label>
                    <select
                      value={assessmentType}
                      onChange={(e) => setAssessmentType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    >
                      <option value="Penilaian Harian">Penilaian Harian</option>
                      <option value="Asesmen Formatif">Asesmen Formatif</option>
                      <option value="Asesmen Sumatif">Asesmen Sumatif</option>
                      <option value="Asesmen Diagnostik">Asesmen Diagnostik</option>
                      <option value="Pengayaan">Pengayaan</option>
                      <option value="Remedial">Remedial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Kesulitan</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    >
                      <option value="Mudah">Mudah</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Menantang">Menantang</option>
                      <option value="HOTS (Higher Order Thinking Skills)">HOTS (Higher Order Thinking Skills)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Materi & Tujuan Pembelajaran */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span>3. Materi & Tujuan Pembelajaran</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Materi / Ruang Lingkup Utama</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Contoh: Pecahan, Keragaman Budaya, Sistem Pernapasan, dll."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tujuan Pembelajaran (TP) / Indikator</label>
                  <textarea
                    rows={3}
                    value={learningObjectives}
                    onChange={(e) => setLearningObjectives(e.target.value)}
                    placeholder="Masukkan satu atau beberapa Tujuan Pembelajaran..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* SECTION 4: Jumlah & Bentuk Soal */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-600" />
                  <span>4. Jumlah & Bentuk Soal</span>
                </h3>

                <div className="w-full sm:w-1/3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Total Soal</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none font-bold text-orange-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Bentuk Soal yang Diinginkan (Bisa pilih lebih dari satu):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {QUESTION_TYPES.map((qt) => {
                      const isChecked = selectedTypes.includes(qt.id);
                      return (
                        <div
                          key={qt.id}
                          onClick={() => handleTypeToggle(qt.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                            isChecked 
                              ? 'bg-orange-50 border-orange-500 text-slate-900 shadow-sm' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 ${
                            isChecked ? 'bg-orange-500 text-black font-bold' : 'border border-slate-400 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <p className="font-bold text-xs">{qt.label}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{qt.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Instruksi Khusus Tambahan untuk AI</label>
                  <textarea
                    rows={2}
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    placeholder="Contoh: Gunakan bahasa daerah sederhana jika relevan, buat soal kontekstual..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t">
                {isGenerating ? (
                  <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl text-center space-y-3">
                    <div className="inline-block p-3 bg-orange-500 text-black rounded-full animate-spin">
                      <RefreshCw className="w-6 h-6" />
                    </div>
                    <p className="text-slate-900 font-bold text-base">AI Sedang Menyusun Soal Asesmen...</p>
                    <p className="text-orange-600 text-xs italic">{generationProgress}</p>
                  </div>
                ) : (
                  <button
                    onClick={generateAssessmentAI}
                    className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-base py-4 px-6 rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                  >
                    <Sparkles className="w-6 h-6 text-black" />
                    <span>✨ BUAT SOAL DENGAN AI SEKARANG</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ==================== 3. RESULT VIEW ==================== */}
        {currentView === 'result' && generatedAssessment && (
          <div className="space-y-6">
            
            {/* Action Bar (Top Print Hidden) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 print:hidden">
              <button
                onClick={() => setCurrentView('form')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Pengaturan</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleAddQuestion}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tambah Soal</span>
                </button>

                <button
                  onClick={copyToClipboard}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                >
                  <Copy className="w-4 h-4" />
                  <span>Salin Teks</span>
                </button>

                <button
                  onClick={downloadWordDoc}
                  className="bg-slate-900 hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
                >
                  <Download className="w-4 h-4 text-orange-400" />
                  <span>Unduh Word (.doc)</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="bg-orange-500 hover:bg-orange-600 text-black font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / PDF</span>
                </button>
              </div>
            </div>

            {/* DOCUMENT PRINT CONTAINER */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-10 font-serif text-slate-900 printable-document">
              
              {/* KOP SEKOLAH DENGAN LOGO ASLI */}
              <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 relative">
                <div className="flex items-center justify-between gap-4">
                  <SchoolLogoComponent className="w-20 h-20 shrink-0 border border-slate-400 rounded-full" />
                  <div className="text-center flex-1">
                    <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider leading-tight">PEMERINTAH KABUPATEN SAMPANG</h3>
                    <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider leading-tight">DINAS PENDIDIKAN</h3>
                    <h2 className="text-lg sm:text-2xl font-extrabold uppercase tracking-wide my-0.5">UPTD SDN DHARMA TANJUNG 1</h2>
                    <p className="text-xs font-sans italic text-slate-600">
                      Jl. Raya Dharma Tanjung, Kec. Camplong, Kabupaten Sampang, Jawa Timur 69251
                    </p>
                  </div>
                  <div className="w-20 hidden sm:block"></div> {/* Spacer balance */}
                </div>
              </div>

              {/* DOCUMENT METADATA */}
              <div className="text-center mb-6">
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider underline">
                  NASKAH ASESMEN {generatedAssessment.metadata.assessmentType}
                </h3>
                <p className="text-xs font-sans text-slate-600 mt-0.5">
                  TAHUN PELAJARAN {generatedAssessment.metadata.academicYear}
                </p>
              </div>

              <div className="grid grid-cols-2 text-xs font-sans gap-y-1 mb-6 border p-3 rounded-lg bg-slate-50">
                <div><b>Mata Pelajaran:</b> {generatedAssessment.metadata.subject}</div>
                <div><b>Hari / Tanggal:</b> {generatedAssessment.metadata.formattedDate}</div>
                <div><b>Kelas / Fase:</b> {generatedAssessment.metadata.classGrade} ({generatedAssessment.metadata.phase})</div>
                <div><b>Semester:</b> {generatedAssessment.metadata.semester}</div>
                <div className="col-span-2"><b>Materi Utama:</b> {generatedAssessment.metadata.topic}</div>
                <div className="col-span-2"><b>Nama Guru:</b> {generatedAssessment.metadata.teacher}</div>
              </div>

              {/* LEMBAR NAMA SISWA */}
              <div className="border border-slate-300 p-3 rounded-md mb-6 font-sans text-xs grid grid-cols-2 gap-4">
                <div>Nama Siswa : .............................................................</div>
                <div>Nomor Absen : .........................</div>
              </div>

              {/* PETUNJUK PENGERJAAN */}
              <div className="mb-6 font-sans text-xs bg-orange-50 p-3 rounded border border-orange-200">
                <p className="font-bold mb-1 text-slate-900">Petunjuk Umum:</p>
                <ol className="list-decimal pl-4 space-y-0.5 text-slate-700">
                  <li>Berdoalah sebelum mengerjakan soal.</li>
                  <li>Tuliskan nama dan nomor absen pada lembar yang telah disediakan.</li>
                  <li>Kerjakan soal yang lebih mudah terlebih dahulu.</li>
                  <li>Periksa kembali jawabanmu sebelum diserahkan kepada guru.</li>
                </ol>
              </div>

              {/* LEMBAR SOAL SISWA */}
              <div className="space-y-6">
                <h4 className="font-sans font-bold text-sm uppercase border-b pb-1">I. LEMBAR SOAL SISWA</h4>

                {generatedAssessment.questions.map((q, idx) => (
                  <div key={idx} className="space-y-2 border-b border-slate-100 pb-4 relative group">
                    
                    {/* Floating Editor Controls */}
                    <div className="absolute right-0 top-0 hidden group-hover:flex items-center gap-1 bg-white border rounded shadow p-1 print:hidden">
                      <button
                        onClick={() => handleDeleteQuestion(idx)}
                        className="text-rose-600 hover:bg-rose-50 p-1 rounded"
                        title="Hapus Soal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <span className="font-bold text-sm">{idx + 1}.</span>
                      <div className="flex-1">
                        <textarea
                          rows={2}
                          value={q.question}
                          onChange={(e) => handleUpdateQuestion(idx, 'question', e.target.value)}
                          className="w-full text-sm font-medium border-transparent hover:border-slate-300 focus:border-orange-500 rounded p-1 outline-none transition resize-y"
                        />

                        {/* Options for Multiple Choice */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pl-2">
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className="text-xs font-sans flex items-center gap-2">
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const newOpts = [...q.options];
                                    newOpts[optIdx] = e.target.value;
                                    handleUpdateQuestion(idx, 'options', newOpts);
                                  }}
                                  className="w-full border-transparent hover:border-slate-300 focus:border-orange-500 rounded p-1"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Matching pairs */}
                        {q.type === 'jodoh' && q.matchingPairs && (
                          <div className="mt-3 font-sans text-xs">
                            <table className="w-full border-collapse border border-slate-300">
                              <thead>
                                <tr className="bg-slate-100">
                                  <th className="border border-slate-300 p-2 text-left">Pernyataan Soal</th>
                                  <th className="border border-slate-300 p-2 text-left">Pasangan Jawaban</th>
                                </tr>
                              </thead>
                              <tbody>
                                {q.matchingPairs.map((mp, mIdx) => (
                                  <tr key={mIdx}>
                                    <td className="border border-slate-300 p-2">{mp.left}</td>
                                    <td className="border border-slate-300 p-2">{mp.right}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* TANDA TANGAN */}
              <div className="mt-12 font-sans text-xs grid grid-cols-2 gap-8 text-center pt-6 border-t">
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-bold mt-0.5">Kepala UPTD SDN DHARMA TANJUNG 1</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">ACH. RISQI BASUKI, S.Pd.M.Si</p>
                  <p>NIP. 196704241988031008</p>
                </div>
                <div>
                  <p>Sampang, {generatedAssessment.metadata.formattedDate}</p>
                  <p className="font-bold mt-0.5">Guru Mata Pelajaran / Kelas</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{generatedAssessment.metadata.teacher}</p>
                </div>
              </div>

              {/* PAGE BREAK FOR PRINTING KEYS */}
              <div className="page-break my-12 border-t-2 border-dashed border-slate-300 pt-8"></div>

              {/* ================= SECTION: KUNCI JAWABAN & KISI-KISI ================= */}
              <div className="space-y-6 font-sans">
                <div className="text-center">
                  <h3 className="text-base font-bold uppercase tracking-wider underline">
                    KUNCI JAWABAN & PEDOMAN PENSKORAN
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Halaman ini terpisah dari Lembar Soal Siswa</p>
                </div>

                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="border border-slate-300 p-2 w-12 text-center">No</th>
                      <th className="border border-slate-300 p-2 text-left w-1/3">Kunci Jawaban</th>
                      <th className="border border-slate-300 p-2 text-left">Pembahasan / Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedAssessment.questions.map((q, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                        <td className="border border-slate-300 p-2">
                          <input
                            type="text"
                            value={q.answer}
                            onChange={(e) => handleUpdateQuestion(idx, 'answer', e.target.value)}
                            className="w-full border-transparent hover:border-slate-300 focus:border-orange-500 rounded p-1 font-semibold text-orange-600"
                          />
                        </td>
                        <td className="border border-slate-300 p-2">
                          <textarea
                            rows={1}
                            value={q.explanation || ''}
                            onChange={(e) => handleUpdateQuestion(idx, 'explanation', e.target.value)}
                            className="w-full border-transparent hover:border-slate-300 focus:border-orange-500 rounded p-1 text-slate-700"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* KISI-KISI MATRIKS */}
                <div className="pt-4">
                  <h4 className="font-bold text-sm uppercase mb-3">MATRIKS KISI-KISI ASESMEN</h4>
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-800 text-white">
                        <th className="border border-slate-300 p-2 w-10 text-center">No</th>
                        <th className="border border-slate-300 p-2 text-left">Tujuan / Indikator Pembelajaran</th>
                        <th className="border border-slate-300 p-2 text-left">Materi</th>
                        <th className="border border-slate-300 p-2 text-center">Bentuk</th>
                        <th className="border border-slate-300 p-2 text-center">Level Kognitif</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedAssessment.questions.map((q, idx) => (
                        <tr key={idx}>
                          <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                          <td className="border border-slate-300 p-2">{q.indicator || generatedAssessment.metadata.learningObjectives}</td>
                          <td className="border border-slate-300 p-2">{generatedAssessment.metadata.topic}</td>
                          <td className="border border-slate-300 p-2 text-center uppercase">{q.type}</td>
                          <td className="border border-slate-300 p-2 text-center">{q.cognitiveLevel || 'L2 (Aplikasi)'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* PEDOMAN PENSKORAN */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <h4 className="font-bold text-sm text-slate-800">PEDOMAN PENSKORAN & RUBRIK:</h4>
                  <p>• Pilihan Ganda: Skor 1 tiap soal benar.</p>
                  <p>• Isian Singkat: Skor 2 tiap soal benar sempurna.</p>
                  <p>• Uraian / HOTS: Skor 3 jika langkah dan penjelasan lengkap, skor 1-2 jika parsial.</p>
                  <p className="font-bold text-orange-600 pt-1 border-t">
                    Rumus Nilai Akhir: {generatedAssessment.scoringRubric.formula}
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ==================== 4. HISTORY VIEW ==================== */}
        {currentView === 'history' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <History className="w-6 h-6 text-orange-600" />
                  <span>Riwayat Soal Tersimpan</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar instrumen asesmen yang pernah dibuat di browser ini.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Cari mata pelajaran / materi..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {historyList.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-3">
                <FileText className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
                <p className="text-sm">Belum ada riwayat soal yang tersimpan.</p>
                <button
                  onClick={() => setCurrentView('form')}
                  className="bg-orange-500 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-600 transition"
                >
                  Buat Soal Pertama
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {historyList
                  .filter(item => 
                    item.metadata.subject.toLowerCase().includes(historySearch.toLowerCase()) ||
                    item.metadata.topic.toLowerCase().includes(historySearch.toLowerCase())
                  )
                  .map((item) => (
                    <div 
                      key={item.id}
                      className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-orange-400 hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            {item.metadata.classGrade}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm">{item.metadata.subject}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2">{item.metadata.topic}</p>
                        <p className="text-[11px] text-slate-500">
                          {item.questions ? item.questions.length : 0} Soal • {item.metadata.assessmentType}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setGeneratedAssessment(item);
                            setCurrentView('result');
                          }}
                          className="bg-black hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-orange-400" />
                          <span>Buka Soal</span>
                        </button>

                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== 5. GUIDE VIEW ==================== */}
        {currentView === 'guide' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-orange-600" />
                <span>Panduan Penggunaan SI PASTI</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Petunjuk praktis penyusunan instrumen soal berstandar Kurikulum Merdeka.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-700">
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  <span>1. Menyusun Soal HOTS</span>
                </h3>
                <p>
                  Pilihlah tingkat kesulitan <b>HOTS (Higher Order Thinking Skills)</b> pada formulir untuk menghasilkan soal analisis, evaluasi, dan pemecahan masalah kontekstual. AI akan menyusun stimulus berupa cerita, grafik, atau situasi nyata siswa SD.
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>2. Pengaturan Multi-Bentuk Soal</span>
                </h3>
                <p>
                  Anda dapat memilih beberapa bentuk soal sekaligus (contoh: Pilihan Ganda, Isian, dan Uraian). AI akan mendistribusikan jumlah soal secara proporsional sesuai total yang Anda tentukan.
                </p>
              </div>

              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-800" />
                  <span>3. Cetak & Unduh Dokumen</span>
                </h3>
                <p>
                  Gunakan tombol <b>Unduh Word (.doc)</b> untuk mengedit naskah soal di Microsoft Word, atau tombol <b>Cetak / PDF</b> untuk langsung mencetak. Kunci jawaban secara otomatis diletakkan pada halaman terpisah.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  <span>4. Edit Langsung di Halaman Pratinjau</span>
                </h3>
                <p>
                  Anda tidak perlu khawatir jika ada penulisan yang kurang pas. Teks soal, opsi jawaban, dan kunci jawaban di halaman hasil dapat diketik dan diedit secara langsung (in-place editor).
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-black text-white border-t border-orange-500 py-4 text-center text-xs print:hidden mt-auto">
        <p><b>SI PASTI</b> — UPTD SDN DHARMA TANJUNG 1 Sampang, Jawa Timur</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Dikembangkan untuk kemudahan tugas guru sekolah dasar.</p>
      </footer>
    </div>
  );
}