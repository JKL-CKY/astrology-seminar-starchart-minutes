import { Request, Response } from 'express';
import { Seminar, EmailData } from '../../../shared/types';
import { WhisperService } from '../services/whisperService';
import { PyannoteService } from '../services/pyannoteService';
import { OpenAIService } from '../services/openaiService';
import { EmailService } from '../services/emailService';
import { generateChartData } from '../utils/astrology';
import * as fs from 'fs';
import * as path from 'path';

const whisperService = new WhisperService();
const pyannoteService = new PyannoteService();
const openaiService = new OpenAIService();
const emailService = new EmailService();

let seminars: Seminar[] = [];

export const createSeminar = async (req: Request, res: Response) => {
  try {
    const { title, topic } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: '请上传音频文件' });
    }

    const seminarId = Date.now().toString();
    const seminar: Seminar = {
      id: seminarId,
      title,
      date: new Date().toISOString(),
      topic,
      chartData: generateChartData(new Date()),
      astrologers: [],
      transcript: [],
      summary: {
        collectiveHoroscope: '',
        themeDiscussion: '',
        keyInsights: []
      },
      status: 'processing'
    };

    seminars.push(seminar);
    res.status(202).json({ seminarId, status: 'processing' });

    await processSeminar(seminarId, file.path);
  } catch (error) {
    console.error('创建研讨会错误:', error);
    res.status(500).json({ error: '创建研讨会失败' });
  }
};

export const getSeminar = (req: Request, res: Response) => {
  const { id } = req.params;
  const seminar = seminars.find(s => s.id === id);

  if (!seminar) {
    return res.status(404).json({ error: '研讨会不存在' });
  }

  res.json(seminar);
};

export const listSeminars = (req: Request, res: Response) => {
  res.json(seminars);
};

export const sendSeminarEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { to } = req.body;

    const seminar = seminars.find(s => s.id === id);
    if (!seminar) {
      return res.status(404).json({ error: '研讨会不存在' });
    }

    if (seminar.status !== 'completed') {
      return res.status(400).json({ error: '研讨会尚未处理完成' });
    }

    const markdown = await openaiService.generateEmailMarkdown(seminar);
    const emailData: EmailData = {
      to,
      subject: `✨ ${seminar.title} - 星盘纪要已送达`,
      markdown
    };

    await emailService.sendEmail(emailData);
    res.json({ message: '邮件发送成功', emailPreview: markdown });
  } catch (error) {
    console.error('发送邮件错误:', error);
    res.status(500).json({ error: '发送邮件失败' });
  }
};

export const getChartData = (req: Request, res: Response) => {
  const { date } = req.query;
  const chartDate = date ? new Date(date as string) : new Date();
  const chartData = generateChartData(chartDate);
  res.json(chartData);
};

async function processSeminar(seminarId: string, audioPath: string) {
  try {
    const seminar = seminars.find(s => s.id === seminarId);
    if (!seminar) return;

    const transcript = await whisperService.transcribeAudio(audioPath);
    const { segments, astrologers } = await pyannoteService.diarizeAudio(audioPath, transcript);
    const summary = await openaiService.generateSummary(segments, astrologers);

    seminar.transcript = segments;
    seminar.astrologers = astrologers;
    seminar.summary = summary;
    seminar.status = 'completed';

    console.log(`✅ 研讨会 ${seminarId} 处理完成`);
  } catch (error) {
    console.error(`处理研讨会 ${seminarId} 错误:`, error);
    const seminar = seminars.find(s => s.id === seminarId);
    if (seminar) {
      seminar.status = 'recording';
    }
  } finally {
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }
  }
}

export const generateDemoSeminar = async (req: Request, res: Response) => {
  try {
    const mockTranscript = await whisperService.transcribeAudio('demo');
    const { segments, astrologers } = await pyannoteService.diarizeAudio('demo', mockTranscript);
    const summary = await openaiService.generateSummary(segments, astrologers);

    const seminar: Seminar = {
      id: Date.now().toString(),
      title: '木星进入金牛座 - 集体运势研讨会',
      date: new Date().toISOString(),
      topic: '木星换座对集体运势的影响',
      chartData: generateChartData(new Date()),
      astrologers,
      transcript: segments,
      summary,
      status: 'completed'
    };

    seminars.push(seminar);
    res.json(seminar);
  } catch (error) {
    console.error('生成演示研讨会错误:', error);
    res.status(500).json({ error: '生成演示研讨会失败' });
  }
};
