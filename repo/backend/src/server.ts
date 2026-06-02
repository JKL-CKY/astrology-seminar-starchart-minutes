import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
  ✨ 占星研讨会后端服务已启动 ✨
  🚀 服务地址: http://localhost:${PORT}
  🔮 健康检查: http://localhost:${PORT}/health
  `);
});
