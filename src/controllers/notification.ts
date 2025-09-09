import {RequestHandler } from 'express';

export const notification: RequestHandler = async (req, res) => {
  try {

    const notifications = [
      {
        id:1,
        title: "Promoção",
        body: "Aproveite nossa nova promoção!"
      },
       {
        id:2,
        title: "Lançamento",
        body: "Temos um novo lançamento!"
      },
       {
        id:3,
        title: "Promoção",
        body: "Aproveite nossa nova promoção!"
      }
    ];

    res.status(200).json(notifications);
    
  } catch (error: any) {
     console.error('Erro ao baixar imagem:', error);
    res.status(500).json({ error: 'Erro ao listar notificações', details: error.message || error });
  }
}
