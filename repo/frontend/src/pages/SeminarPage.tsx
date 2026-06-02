import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { seminarApi } from '../services/api';
import StarChart from '../components/StarChart';
import PlanetAspect from '../components/PlanetAspect';
import SeminarNotes from '../components/SeminarNotes';
import AstrologerPanel from '../components/AstrologerPanel';
import SummaryPanel from '../components/SummaryPanel';
import { Seminar, Aspect } from '../../../shared/types';

export default function SeminarPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [seminar, setSeminar] = useState<Seminar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chart' | 'notes' | 'summary'>('chart');
  const [hoveredAspect, setHoveredAspect] = useState<Aspect | null>(null);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSeminar = async () => {
      try {
        const response = await seminarApi.get(id);
        setSeminar(response.data);
      } catch (error) {
        console.error('获取研讨会信息失败:', error);
      } finally {
        setIsLoading(false);
      }
      };

    fetchSeminar();

    const interval = setInterval(() => {
      if (seminar?.status === 'processing') {
        fetchSeminar();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id, seminar?.status]);

  const handleSendEmail = async () => {
    if (!id || !email) return;
    setIsSending(true);
    try {
      await seminarApi.sendEmail(id, email);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
      console.error('发送邮件失败:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-8xl mb-4"
          >
            ✨
          </motion.div>
          <p className="text-purple-300 text-xl">正在加载研讨会数据...</p>
        </div>
      </div>
    );
  }

  if (!seminar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-8xl mb-4 block">🔍</span>
          <p className="text-purple-300 text-xl mb-4">研讨会不存在</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-purple-800/50 rounded-lg hover:bg-purple-700/50 transition-colors flex items-center gap-2"
          >
            ← 返回首页
          </button>

          {seminar.status === 'completed' && (
            <div className="flex items-center gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="输入邮箱地址"
                className="px-4 py-2 bg-purple-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none"
              />
              <button
                onClick={handleSendEmail}
                disabled={!email || isSending}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50"
              >
                {isSending ? '发送中...' : emailSent ? '✅ 已发送' : '📧 发送邮件'}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {seminar.title}
          </h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium`}
            style={{
              backgroundColor: seminar.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
              color: seminar.status === 'completed' ? '#10b981' : '#fbbf24'
            }}
          >
            {seminar.status === 'completed' ? '✅ 已完成' : seminar.status === 'processing' ? '⏳ 处理中' : '🎙️ 录制中'}
          </span>
        </div>
        <p className="text-purple-400">
          📅 {new Date(seminar.date).toLocaleString('zh-CN')} · 🎯 {seminar.topic}
        </p>
      </motion.div>

      {seminar.status === 'processing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-6 mb-8 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-5xl mb-4 inline-block"
          >
            ⚙️
          </motion.div>
          <h3 className="text-xl font-bold text-amber-300 mb-2">正在处理研讨会录音...</h3>
          <p className="text-amber-200/80">AI正在转写语音、识别说话人、生成摘要，这可能需要几分钟时间</p>
          <p className="text-sm text-amber-300/60 mt-2">页面会自动刷新，请耐心等待 ✨</p>
        </motion.div>
      )}

      <div className="flex gap-2 mb-6">
        {[
          { id: 'chart', label: '星图', icon: '🔮' },
          { id: 'notes', label: '纪要', icon: '📜' },
          { id: 'summary', label: '摘要', icon: '✨' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/30 text-purple-300 hover:bg-purple-800/50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
            >
              <h2 className="text-2xl font-bold mb-6 text-purple-200 flex items-center gap-2">
                <span className="text-3xl">🌟</span>
                动态星图
              </h2>
              <StarChart
                planets={seminar.chartData.planets}
                aspects={hoveredAspect ? [hoveredAspect, ...seminar.chartData.aspects.filter(a => a !== hoveredAspect)] : seminar.chartData.aspects}
              />
            </motion.div>
          </div>

          <div className="space-y-6">
            <AstrologerPanel astrologers={seminar.astrologers} />
            <PlanetAspect
              aspects={seminar.chartData.aspects}
              onAspectHover={setHoveredAspect}
            />
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SeminarNotes transcript={seminar.transcript} astrologers={seminar.astrologers} />
          <AstrologerPanel astrologers={seminar.astrologers} />
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SummaryPanel
            collectiveHoroscope={seminar.summary.collectiveHoroscope}
            themeDiscussion={seminar.summary.themeDiscussion}
            keyInsights={seminar.summary.keyInsights}
          />
          <div className="space-y-6">
            <PlanetAspect aspects={seminar.chartData.aspects} onAspectHover={setHoveredAspect} />
            <AstrologerPanel astrologers={seminar.astrologers} />
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
