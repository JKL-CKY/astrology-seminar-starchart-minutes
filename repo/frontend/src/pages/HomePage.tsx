import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { seminarApi } from '../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('木星进入金牛座 - 集体运势研讨会');
  const [topic, setTopic] = useState('木星换座对集体运势的影响');

  const handleDemo = async () => {
    setIsLoading(true);
    try {
      const response = await seminarApi.generateDemo();
      navigate(`/seminar/${response.data.id}`);
    } catch (error) {
      console.error('生成演示失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);
      formData.append('title', title);
      formData.append('topic', topic);

      const response = await seminarApi.create(formData);
      navigate(`/seminar/${response.data.seminarId}`);
    } catch (error) {
      console.error('创建研讨会失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl mb-4"
          >
            🔮
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            占星研讨会
          </h1>
          <p className="text-xl text-purple-300 mb-2">星盘纪要 · 轻松有趣</p>
          <p className="text-gray-400">上传研讨会录音，AI自动生成专业的占星纪要</p>
        </div>

        <div className="bg-purple-900/30 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-purple-200 mb-2 font-medium">研讨会标题</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-purple-800/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 transition-all"
                placeholder="输入研讨会标题"
              />
            </div>

            <div>
              <label className="block text-purple-200 mb-2 font-medium">研讨主题</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 bg-purple-800/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 transition-all"
                placeholder="输入研讨主题"
              />
            </div>

            <div>
              <label className="block text-purple-200 mb-2 font-medium">上传音频文件</label>
              <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 text-center hover:border-purple-400/50 transition-all cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="audio-upload"
                />
                <label htmlFor="audio-upload" className="cursor-pointer">
                  {selectedFile ? (
                    <div>
                      <span className="text-4xl mb-2 block">🎵</span>
                      <p className="text-purple-200 font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-purple-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-4xl mb-2 block">📁</span>
                      <p className="text-purple-300">点击或拖拽上传音频文件</p>
                      <p className="text-sm text-purple-500 mt-1">支持 MP3, WAV, M4A 等格式</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!selectedFile || isLoading}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">✨</span> 处理中...
                  </>
                ) : (
                  <>
                    <span>🚀</span> 开始处理
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleDemo}
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl font-bold text-white hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🎭 演示
              </motion.button>
            </div>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '🎙️', title: '智能转写', desc: 'Whisper AI 语音识别' },
            { icon: '👥', title: '说话人分离', desc: 'Pyannote 区分占星师' },
            { icon: '✨', title: 'AI 摘要', desc: 'OpenAI 生成精彩纪要' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-purple-900/20 rounded-2xl p-6 border border-purple-500/20"
            >
              <span className="text-4xl mb-3 block">{item.icon}</span>
              <h3 className="font-bold text-purple-200 mb-1">{item.title}</h3>
              <p className="text-sm text-purple-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
