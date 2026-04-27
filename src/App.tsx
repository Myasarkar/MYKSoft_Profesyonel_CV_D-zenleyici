/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Download, 
  User, 
  Briefcase, 
  GraduationCap, 
  Calendar,
  Smartphone,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  type: string;
  description: string;
}

const initialExperience: Experience[] = [];

const themeClasses: Record<string, {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  hoverText: string;
  hoverBorder: string;
  lightBg: string;
  lightText: string;
  lightBorder: string;
  shadow: string;
  focusRing: string;
  accentBorder: string;
}> = {
  indigo: {
    bg: 'bg-indigo-600',
    text: 'text-indigo-600',
    border: 'border-indigo-600',
    hoverBg: 'hover:bg-indigo-700',
    hoverText: 'hover:text-indigo-600',
    hoverBorder: 'hover:border-indigo-300',
    lightBg: 'bg-indigo-50',
    lightText: 'text-indigo-700',
    lightBorder: 'border-indigo-100',
    shadow: 'shadow-indigo-200',
    focusRing: 'focus:ring-indigo-500',
    accentBorder: 'border-indigo-700'
  },
  blue: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-600',
    hoverBg: 'hover:bg-blue-700',
    hoverText: 'hover:text-blue-600',
    hoverBorder: 'hover:border-blue-300',
    lightBg: 'bg-blue-50',
    lightText: 'text-blue-700',
    lightBorder: 'border-blue-100',
    shadow: 'shadow-blue-200',
    focusRing: 'focus:ring-blue-500',
    accentBorder: 'border-blue-700'
  },
  emerald: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-600',
    border: 'border-emerald-600',
    hoverBg: 'hover:bg-emerald-700',
    hoverText: 'hover:text-emerald-600',
    hoverBorder: 'hover:border-emerald-300',
    lightBg: 'bg-emerald-50',
    lightText: 'text-emerald-700',
    lightBorder: 'border-emerald-100',
    shadow: 'shadow-emerald-200',
    focusRing: 'focus:ring-emerald-500',
    accentBorder: 'border-emerald-700'
  },
  rose: {
    bg: 'bg-rose-600',
    text: 'text-rose-600',
    border: 'border-rose-600',
    hoverBg: 'hover:bg-rose-700',
    hoverText: 'hover:text-rose-600',
    hoverBorder: 'hover:border-rose-300',
    lightBg: 'bg-rose-50',
    lightText: 'text-rose-700',
    lightBorder: 'border-rose-100',
    shadow: 'shadow-rose-200',
    focusRing: 'focus:ring-rose-500',
    accentBorder: 'border-rose-700'
  },
  amber: {
    bg: 'bg-amber-600',
    text: 'text-amber-600',
    border: 'border-amber-600',
    hoverBg: 'hover:bg-amber-700',
    hoverText: 'hover:text-amber-600',
    hoverBorder: 'hover:border-amber-300',
    lightBg: 'bg-amber-50',
    lightText: 'text-amber-700',
    lightBorder: 'border-amber-100',
    shadow: 'shadow-amber-200',
    focusRing: 'focus:ring-amber-500',
    accentBorder: 'border-amber-700'
  },
  slate: {
    bg: 'bg-slate-600',
    text: 'text-slate-600',
    border: 'border-slate-600',
    hoverBg: 'hover:bg-slate-700',
    hoverText: 'hover:text-slate-600',
    hoverBorder: 'hover:border-slate-300',
    lightBg: 'bg-slate-50',
    lightText: 'text-slate-700',
    lightBorder: 'border-slate-100',
    shadow: 'shadow-slate-200',
    focusRing: 'focus:ring-slate-500',
    accentBorder: 'border-slate-700'
  },
  violet: {
    bg: 'bg-violet-600',
    text: 'text-violet-600',
    border: 'border-violet-600',
    hoverBg: 'hover:bg-violet-700',
    hoverText: 'hover:text-violet-600',
    hoverBorder: 'hover:border-violet-300',
    lightBg: 'bg-violet-50',
    lightText: 'text-violet-700',
    lightBorder: 'border-violet-100',
    shadow: 'shadow-violet-200',
    focusRing: 'focus:ring-violet-500',
    accentBorder: 'border-violet-700'
  }
};

export default function App() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState('indigo');
  const currentTheme = themeClasses[themeColor] || themeClasses.indigo;
  
  const [personalInfo, setPersonalInfo] = useState({
    status: '',
    nationality: '',
    tcNo: '',
    totalExperience: '',
    birthDate: '',
    education: '',
    location: '',
    birthPlace: '',
    maritalStatus: '',
    smoking: '',
    license: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    military: ''
  });

  const [workInfo, setWorkInfo] = useState({
    title: '',
    type: '',
    salaryExpectation: '',
    desiredPositions: '',
    desiredSectors: ''
  });

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [lastUpdateDate, setLastUpdateDate] = useState(new Date().toLocaleDateString('tr-TR'));
  const [isDownloading, setIsDownloading] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('cv_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.name) setName(data.name);
        if (data.role) setRole(data.role);
        if (data.phone) setPhone(data.phone);
        if (data.email) setEmail(data.email);
        if (data.address) setAddress(data.address);
        if (data.detailedAddress) setDetailedAddress(data.detailedAddress);
        if (data.personalInfo) setPersonalInfo(data.personalInfo);
        if (data.workInfo) setWorkInfo(data.workInfo);
        if (data.experiences) setExperiences(data.experiences);
        if (data.avatar) setAvatar(data.avatar);
        if (data.themeColor) setThemeColor(data.themeColor);
      } catch (e) {
        console.error('Error loading data from localStorage', e);
      }
    }
  }, []);

  // Automatically update the date when any field changes and save to localStorage
  useEffect(() => {
    setLastUpdateDate(new Date().toLocaleDateString('tr-TR'));
    
    const dataToSave = {
      name, role, phone, email, address, detailedAddress,
      personalInfo, workInfo, experiences, avatar, themeColor
    };
    localStorage.setItem('cv_data', JSON.stringify(dataToSave));
  }, [name, role, phone, email, address, detailedAddress, personalInfo, workInfo, experiences, avatar, themeColor]);

  const downloadPDF = async () => {
    if (!cvRef.current || isDownloading) return;
    
    setIsDownloading(true);
    try {
      // Small delay to ensure any pending renders are complete
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(cvRef.current, {
        scale: 4, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: 1024, // Sufficient width to prevent mobile layout triggers
        onclone: (clonedDoc) => {
          const cv = clonedDoc.getElementById('cv-display');
          if (cv) {
            cv.style.transform = 'none';
            cv.style.margin = '0';
            cv.style.position = 'relative';
            cv.style.top = '0';
            cv.style.left = '0';
            cv.style.width = '210mm'; // Use real dimensions
            cv.style.height = '297mm';
            
            // Fix text rendering issues in html2canvas
            const textElements = cv.querySelectorAll('span, p, h1, h2, h3, h4, h5');
            textElements.forEach((el) => {
              (el as HTMLElement).style.letterSpacing = 'normal';
              (el as HTMLElement).style.fontKerning = 'none';
            });
          }
          
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            :root {
              color-scheme: light !important;
              font-family: 'Inter', sans-serif !important;
            }
            #cv-display {
              font-family: 'Inter', sans-serif !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              text-rendering: optimizeLegibility !important;
              -webkit-font-smoothing: antialiased !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`${name.replace(/\s+/g, '_')}_CV.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleWorkInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Dosya boyutu 2MB dan küçük olmalıdır.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

const personalInfoLabels: { [key: string]: string } = {
    status: 'Çalışma Durumu',
    nationality: 'Uyruğu',
    tcNo: 'TC Kimlik No',
    totalExperience: 'Toplam İş Deneyimi',
    birthDate: 'Doğum Tarihi',
    education: 'Eğitim Durumu',
    location: 'Bulunduğu Yer',
    birthPlace: 'Doğum Yeri',
    maritalStatus: 'Medeni Durumu',
    smoking: 'Sigara',
    license: 'Ehliyet',
    gender: 'Cinsiyet',
    age: 'Yaş',
    height: 'Boy (cm)',
    weight: 'Kilo',
    military: 'Askerlik'
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans text-slate-800 overflow-hidden relative">
      
      {/* Mobile Header Toggle */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <h2 className="font-bold text-slate-900 flex items-center gap-2 text-sm italic">
          <div className={`w-6 h-6 ${currentTheme.bg} rounded flex items-center justify-center text-white text-[10px] font-bold not-italic`}>CV</div>
          MYKSoft Profesyonel
        </h2>
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setIsEditing(true)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${isEditing ? `bg-white shadow-sm ${currentTheme.text}` : 'text-slate-500 hover:text-slate-700'}`}
          >
            Düzenle
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${!isEditing ? `bg-white shadow-sm ${currentTheme.text}` : 'text-slate-500 hover:text-slate-700'}`}
          >
            Önizle
          </button>
        </div>
      </div>
         
      {/* Editor Sidebar */}
      <div className={`${isEditing ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 bg-white border-r border-slate-200 flex-col p-6 shadow-sm lg:overflow-y-auto lg:max-h-screen relative z-10`}>
        <div className="flex items-center justify-between gap-3 mb-10">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <div className={`w-10 h-10 ${currentTheme.bg} rounded flex items-center justify-center text-white font-bold`}>CV</div>
            CV Editörü
          </h2>
          <button 
            onClick={() => setIsEditing(false)}
            className={`hidden lg:block text-sm font-medium ${currentTheme.lightText} ${currentTheme.lightBg} border ${currentTheme.lightBorder} ${currentTheme.hoverBg} hover:text-white px-3 py-1 rounded-lg transition-colors`}
          >
            Önizleme
          </button>
        </div>

          <div className="space-y-6">
            {/* Theme Selection */}
            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Tema Rengi</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'indigo', color: '#4f46e5' },
                  { name: 'blue', color: '#2563eb' },
                  { name: 'emerald', color: '#059669' },
                  { name: 'rose', color: '#e11d48' },
                  { name: 'amber', color: '#d97706' },
                  { name: 'slate', color: '#475569' },
                  { name: 'violet', color: '#7c3aed' }
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setThemeColor(c.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${themeColor === c.name ? 'border-slate-900 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                  />
                ))}
              </div>
            </section>

            {/* Basic Info */}
            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Temel Bilgiler</h3>
              <div className="space-y-3">
                <div className="flex flex-col items-center mb-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 hover:${currentTheme.border} cursor-pointer group relative`}
                  >
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className={`text-slate-400 group-hover:${currentTheme.text}`} />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Plus size={20} className="text-white" />
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">Avatar Yükle (Maks 2MB)</p>
                  {avatar && (
                    <button 
                      onClick={() => setAvatar(null)}
                      className="text-[10px] text-red-500 mt-1 hover:underline"
                    >
                      Kaldır
                    </button>
                  )}
                </div>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ad Soyad"
                  className={`w-full border-slate-200 border rounded-lg p-2 text-sm focus:ring-2 ${currentTheme.focusRing} focus:outline-none`}
                />
                <input 
                  type="text" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ünvan"
                  className={`w-full border-slate-200 border rounded-lg p-2 text-sm focus:ring-2 ${currentTheme.focusRing} focus:outline-none`}
                />
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Telefon"
                  className={`w-full border-slate-200 border rounded-lg p-2 text-sm focus:ring-2 ${currentTheme.focusRing} focus:outline-none`}
                />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta"
                  className={`w-full border-slate-200 border rounded-lg p-2 text-sm focus:ring-2 ${currentTheme.focusRing} focus:outline-none`}
                />
                <input 
                  type="text" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Şehir / İlçe"
                  className={`w-full border-slate-200 border rounded-lg p-2 text-sm focus:ring-2 ${currentTheme.focusRing} focus:outline-none`}
                />
                <input 
                  type="text" 
                  value={detailedAddress} 
                  onChange={(e) => setDetailedAddress(e.target.value)}
                  placeholder="Detaylı Adres"
                  className={`w-full border-slate-200 border rounded-lg p-2 text-sm focus:ring-2 ${currentTheme.focusRing} focus:outline-none`}
                />
              </div>
            </section>

            {/* Personal Info Grid */}
            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Kişisel Bilgiler</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(personalInfo).map((key) => (
                  <div key={key}>
                    <label className="text-[10px] text-slate-400 block mb-1 uppercase">
                      {personalInfoLabels[key] || key}
                    </label>
                    <input 
                      name={key}
                      type="text" 
                      value={(personalInfo as any)[key]} 
                      onChange={handlePersonalInfoChange}
                      className={`w-full border-slate-200 border rounded-lg p-2 text-xs focus:ring-2 ${currentTheme.focusRing} focus:outline-none`}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Work Info */}
            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Çalışma Bilgileri</h3>
              <div className="space-y-3">
                <input 
                  name="title"
                  type="text" 
                  value={workInfo.title} 
                  onChange={handleWorkInfoChange}
                  placeholder="Ünvan / Meslek"
                  className={`w-full border-slate-200 border rounded-lg p-2 text-sm focus:ring-2 ${currentTheme.focusRing} focus:outline-none`}
                />
                <input 
                  name="type"
                  type="text" 
                  value={workInfo.type} 
                  onChange={handleWorkInfoChange}
                  placeholder="Çalışma Şekli"
                  className={`w-full border-slate-200 border rounded-lg p-2 text-sm focus:ring-2 ${currentTheme.focusRing} focus:outline-none`}
                />
                <input 
                  name="salaryExpectation"
                  type="text" 
                  value={workInfo.salaryExpectation} 
                  onChange={handleWorkInfoChange}
                  placeholder="Ücret Beklentisi"
                  className={`w-full border-slate-200 border rounded-lg p-2 text-sm focus:ring-2 ${currentTheme.focusRing} focus:outline-none`}
                />
                <textarea 
                  name="desiredPositions"
                  value={workInfo.desiredPositions} 
                  onChange={handleWorkInfoChange}
                  placeholder="Çalışmak İstediği Pozisyonlar"
                  className={`w-full border-slate-200 border rounded-lg p-2 text-xs focus:ring-2 ${currentTheme.focusRing} focus:outline-none min-h-[60px]`}
                />
                <input 
                  name="desiredSectors"
                  type="text" 
                  value={workInfo.desiredSectors} 
                  onChange={handleWorkInfoChange}
                  placeholder="Çalışmak İstediği Sektörler"
                  className={`w-full border-slate-200 border rounded-lg p-2 text-xs focus:ring-2 ${currentTheme.focusRing} focus:outline-none`}
                />
              </div>
            </section>

            {/* Experiences */}
            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">İş Deneyimleri</h3>
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50 relative group">
                    <button 
                      onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                    <input 
                      type="text" 
                      value={exp.company} 
                      onChange={(e) => {
                        const newExp = [...experiences];
                        newExp[index].company = e.target.value;
                        setExperiences(newExp);
                      }}
                      className="w-full bg-transparent font-bold text-xs mb-1 focus:outline-none"
                      placeholder="Şirket"
                    />
                    <input 
                      type="text" 
                      value={exp.title} 
                      onChange={(e) => {
                        const newExp = [...experiences];
                        newExp[index].title = e.target.value;
                        setExperiences(newExp);
                      }}
                      className="w-full bg-transparent text-[10px] mb-2 focus:outline-none"
                      placeholder="Pozisyon"
                    />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                       <input 
                        type="text" 
                        value={exp.startDate} 
                        onChange={(e) => {
                          const newExp = [...experiences];
                          newExp[index].startDate = e.target.value;
                          setExperiences(newExp);
                        }}
                        className="bg-white border rounded p-1 text-[9px] focus:outline-none"
                        placeholder="Başlangıç (örn: 01.01.2024)"
                      />
                      <input 
                        type="text" 
                        value={exp.endDate} 
                        onChange={(e) => {
                          const newExp = [...experiences];
                          newExp[index].endDate = e.target.value;
                          setExperiences(newExp);
                        }}
                        className="bg-white border rounded p-1 text-[9px] focus:outline-none"
                        placeholder="Bitiş (örn: Devam)"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                       <input 
                        type="text" 
                        value={exp.location} 
                        onChange={(e) => {
                          const newExp = [...experiences];
                          newExp[index].location = e.target.value;
                          setExperiences(newExp);
                        }}
                        className="bg-white border rounded p-1 text-[9px] focus:outline-none"
                        placeholder="Şehir"
                      />
                      <input 
                        type="text" 
                        value={exp.type} 
                        onChange={(e) => {
                          const newExp = [...experiences];
                          newExp[index].type = e.target.value;
                          setExperiences(newExp);
                        }}
                        className="bg-white border rounded p-1 text-[9px] focus:outline-none"
                        placeholder="Çalışma Şekli"
                      />
                    </div>
                    <textarea 
                      value={exp.description} 
                      onChange={(e) => {
                        const newExp = [...experiences];
                        newExp[index].description = e.target.value;
                        setExperiences(newExp);
                      }}
                      className="w-full bg-white border rounded p-1 text-[9px] mt-2 focus:outline-none min-h-[40px]"
                      placeholder="İş Tanımı"
                    />
                  </div>
                ))}
                <button 
                  onClick={() => setExperiences([...experiences, {
                    id: Math.random().toString(36).substr(2, 9),
                    company: 'Yeni Şirket',
                    title: 'Pozisyon',
                    startDate: '01.01.2024',
                    endDate: '01.01.2025',
                    location: 'Şehir',
                    type: 'Tam zamanlı',
                    description: 'İş tanımı'
                  }])}
                  className={`w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs flex items-center justify-center gap-2 hover:${currentTheme.hoverBorder} hover:${currentTheme.text} transition-colors`}
                >
                  <Plus size={14} />
                  Yeni Deneyim Ekle
                </button>
              </div>
            </section>

            <div className="mt-8">
              <button 
                onClick={downloadPDF}
                disabled={isDownloading}
                className={`w-full ${currentTheme.bg} text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 ${currentTheme.hoverBg} transition-all shadow-lg ${currentTheme.shadow} ${isDownloading ? 'opacity-70 cursor-not-allowed scale-95' : 'active:scale-95'}`}
              >
                {isDownloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    HAZIRLANIYOR...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    PDF OLARAK İNDİR
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CV Preview */}
        <div className={`${!isEditing ? 'flex' : 'hidden'} lg:flex flex-1 p-4 lg:p-12 justify-center items-center bg-slate-200 overflow-y-auto min-h-screen lg:min-h-0 relative`}>
          {/* Floating Download Button for Preview Mode - Visible on Desktop and Mobile Preview */}
          <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50">
            <button 
              onClick={downloadPDF}
              disabled={isDownloading}
              className={`w-14 h-14 lg:w-auto lg:px-6 lg:h-12 ${currentTheme.bg} text-white rounded-full lg:rounded-xl font-bold flex items-center justify-center gap-2 ${currentTheme.hoverBg} transition-all shadow-2xl active:scale-95 ${isDownloading ? 'opacity-70 cursor-not-allowed' : ''}`}
              title="PDF Olarak İndir"
            >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Download size={20} />
                  <span className="hidden lg:inline">PDF İNDİR</span>
                </>
              )}
            </button>
          </div>

          <div 
            ref={cvRef}
            className="w-[210mm] h-[297mm] min-h-[297mm] flex-shrink-0 bg-white shadow-2xl flex overflow-hidden origin-top scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-[0.9] xl:scale-100 rounded-sm"
            id="cv-display"
          >
            <div className="w-[30%] bg-slate-100 flex flex-col relative px-4 pt-10 pb-6">
              <div className={`absolute top-0 left-0 w-full h-44 ${currentTheme.bg} flex items-center justify-center text-white text-center p-6 border-b-4 ${currentTheme.accentBorder}`}>
                <h1 className="text-xl font-extrabold leading-tight uppercase line-clamp-3">{name || 'Ad Soyad'}</h1>
              </div>

              <div className="mt-32 flex flex-col items-center relative z-10">
                <div className="w-28 h-28 bg-white rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={64} className="text-slate-300" />
                  )}
                </div>
                <div className="mt-4 text-center w-full px-2 min-h-[3rem]">
                  <p className={`${currentTheme.text} font-bold tracking-widest text-[10px] uppercase line-clamp-2`}>{role}</p>
                </div>
              </div>

              <div className="space-y-6 text-left mt-2 px-2">
                <div>
                  <h3 className="text-xs font-black text-slate-900 tracking-wider border-b border-slate-300 pb-1 mb-4 flex items-center gap-2 justify-center">
                    İLETİŞİM
                  </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-600 lg:text-[10px] xl:text-xs">
                        <div className={`bg-white p-1 rounded border border-slate-200 shadow-sm ${currentTheme.text}`}>
                          <Smartphone size={14} />
                        </div>
                        <span>{phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 lg:text-[10px] xl:text-xs overflow-hidden">
                        <div className={`bg-white p-1 rounded border border-slate-200 shadow-sm ${currentTheme.text} flex-shrink-0`}>
                          <Mail size={14} />
                        </div>
                        <span className="break-all leading-tight">{email}</span>
                      </div>
                      <div className="flex items-start gap-3 text-xs text-slate-600 lg:text-[10px] xl:text-xs">
                        <div className={`bg-white p-1 rounded border border-slate-200 shadow-sm mt-0.5 ${currentTheme.text}`}>
                          <MapPin size={14} />
                        </div>
                        <span>{address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              
              <div className="mt-auto pt-10 relative">
                 <div className="w-full h-24 bg-slate-200 bg-opacity-50 clip-path-polygon"></div>
                 <div className="absolute bottom-2 left-2 text-[8px] font-bold text-slate-400 opacity-30 select-none">
                    MYKSoft
                 </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-[70%] p-8 bg-white">
              {/* Header */}
              <div className={`flex justify-between items-start mb-8 border-b-4 ${currentTheme.border} pb-4`}>
                <div>
                   <p className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">Güncelleme Tarihi : {lastUpdateDate}</p>
                </div>
                <div>
                   {/* Brand Removed as requested */}
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {/* Personal Info */}
                <section>
                  <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-2">
                    <div className={`${currentTheme.lightBg} p-2 rounded ${currentTheme.lightText}`}>
                      <User size={18} />
                    </div>
                    <h2 className="text-[11px] font-black text-slate-900 tracking-wider">KİŞİSEL BİLGİLER</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 bg-slate-50 text-[10px]">
                    <div className="p-1 border-r border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">ÇALIŞMA DURUMU</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.status}</span>
                    </div>
                    <div className="p-1 border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">UYRUĞU</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.nationality}</span>
                    </div>
                    <div className="p-1 border-r border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">TC KİMLİK NO</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.tcNo}</span>
                    </div>
                    <div className="p-1 border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">TOPLAM İŞ DENEYİMİ</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.totalExperience}</span>
                    </div>
                    <div className="p-1 border-r border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">DOĞUM TARİHİ</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.birthDate}</span>
                    </div>
                    <div className="p-1 border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">EĞİTİM DURUMU</span>
                      <span className="w-1/2 p-1 text-slate-800 font-bold">{personalInfo.education}</span>
                    </div>
                    <div className="p-1 border-r border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">BULUNDUĞU YER</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.location}</span>
                    </div>
                    <div className="p-1 border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">DOĞUM YERİ</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.birthPlace}</span>
                    </div>
                    <div className="p-1 border-r border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">MEDENİ DURUMU</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.maritalStatus}</span>
                    </div>
                    <div className="p-1 border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">SİGARA</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.smoking}</span>
                    </div>
                    <div className="p-1 border-r border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">EHLİYET</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.license}</span>
                    </div>
                    <div className="p-1 border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">CİNSİYET</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.gender}</span>
                    </div>
                    <div className="p-1 border-r border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">YAŞ</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.age}</span>
                    </div>
                    <div className="p-1 border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">BOY (cm)</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.height}</span>
                    </div>
                    <div className="p-1 border-r border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">KİLO</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.weight}</span>
                    </div>
                    <div className="p-1 border-b border-white flex">
                      <span className="w-1/2 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">ASKERLİK</span>
                      <span className="w-1/2 p-1 text-slate-800">{personalInfo.military}</span>
                    </div>
                  </div>
                  <div className="mt-2 bg-slate-50 p-1 text-[10px] flex">
                    <span className="w-1/4 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">ADRES</span>
                    <span className="w-3/4 p-1 text-slate-800">{detailedAddress}</span>
                  </div>
                </section>

                {/* Working Info */}
                <section>
                  <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-2">
                    <div className={`${currentTheme.lightBg} p-2 rounded ${currentTheme.lightText}`}>
                      <Briefcase size={18} />
                    </div>
                    <h2 className="text-[11px] font-black text-slate-900 tracking-wider">ÇALIŞMA BİLGİLERİ</h2>
                  </div>
                  
                  <div className="space-y-1 text-[10px]">
                    <div className="flex bg-slate-50">
                      <span className="w-1/4 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">ÜNVAN / MESLEK</span>
                      <span className="w-3/4 p-1 text-slate-800">{workInfo.title}</span>
                    </div>
                    <div className="flex bg-slate-50">
                      <span className="w-1/4 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">ÇALIŞMA ŞEKLİ</span>
                      <span className="w-3/4 p-1 text-slate-800">{workInfo.type}</span>
                    </div>
                    <div className="flex bg-slate-50">
                      <span className="w-1/4 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">ÜCRET BEKLENTİSİ</span>
                      <span className="w-3/4 p-1 text-slate-800">{workInfo.salaryExpectation}</span>
                    </div>
                    <div className="flex bg-slate-50">
                      <span className="w-1/4 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">ÇALIŞMAK İSTEDİĞİ POZİSYONLAR</span>
                      <span className="w-3/4 p-1 text-slate-800">{workInfo.desiredPositions}</span>
                    </div>
                    <div className="flex bg-slate-50">
                      <span className="w-1/4 bg-slate-200 bg-opacity-50 p-1 font-semibold text-slate-600">ÇALIŞMAK İSTEDİĞİ SEKTÖRLER</span>
                      <span className="w-3/4 p-1 text-slate-800">{workInfo.desiredSectors}</span>
                    </div>
                  </div>
                </section>

                {/* Work Experience */}
                <section>
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-2">
                    <div className={`${currentTheme.lightBg} p-2 rounded ${currentTheme.lightText}`}>
                      <Briefcase size={18} />
                    </div>
                    <h2 className="text-[11px] font-black text-slate-900 tracking-wider">İŞ DENEYİMLERİ</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative pl-4 border-l-2 border-slate-100">
                        <div className="flex flex-col gap-1 mb-2">
                           <h4 className="text-xs font-bold text-slate-900">{exp.company}</h4>
                           <h5 className="text-[10px] text-slate-400 font-medium italic">{exp.title} | {exp.startDate.split('.')[2]} - {exp.endDate.split('.')[2]}</h5>
                           
                           <div className="grid grid-cols-1 gap-1 text-[10px] text-slate-600 mt-2 leading-relaxed bg-slate-50 p-2 rounded">
                             <p><span className="font-semibold">Çalışma Şekli :</span> {exp.type}</p>
                             <p><span className="font-semibold">Çalışma Yeri :</span> {exp.location}</p>
                             <p><span className="font-semibold">Giriş Tarihi :</span> {exp.startDate}</p>
                             <p><span className="font-semibold">Çıkış Tarihi :</span> {exp.endDate}</p>
                             <p className="mt-1"><span className="font-semibold">İş Tanımı :</span> {exp.description}</p>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
