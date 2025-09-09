import {RequestHandler } from 'express';
import fetch from 'node-fetch';


export const images: RequestHandler = async (req, res) => {
  try {
    const imagePath = req.query.path as string | undefined;
    if (!imagePath) {
      res.status(400).json({ error: 'Caminho da imagem não fornecido' });
      return;
    }

    const nextcloudBaseUrl = process.env.NEXTCLOUD_URL || '';
    const fileUrl = nextcloudBaseUrl.endsWith('/')
      ? nextcloudBaseUrl + imagePath
      : nextcloudBaseUrl + '/' + imagePath;

    const basicAuth = 'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`).toString('base64');
    const response = await fetch(fileUrl, {
      headers: { Authorization: basicAuth },
    });

    if (!response.ok || !response.body) {
      res.status(response.status).send('Erro ao baixar imagem');
      return;
    }

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');

    const fileName = imagePath.split('/').pop() || 'imagem';
    res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(fileName)}`);

    response.body.pipe(res);
  } catch (error: any) {
    console.error('Erro ao baixar imagem:', error);
    res.status(500).json({ error: 'Erro ao baixar imagem', details: error.message || error });
  }
};