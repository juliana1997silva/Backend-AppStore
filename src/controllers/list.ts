import { RequestHandler } from "express";
import fs from "fs";
import { BASE_FOLDER } from "..";
import path from "path";
import { stringToIntId } from "../utils/stringToIntId";

export const list: RequestHandler = async (req, res) => {
  try {
    const folders = fs.readdirSync(BASE_FOLDER, {withFileTypes: true})
      .filter(dirent => dirent.isDirectory() && dirent.name !== "androidTest")
      .map(dirent => {

        const folderPath = path.join(BASE_FOLDER, dirent.name);
        const detailsPath = path.join(folderPath, "details");
        let image: string | null = null;

        if (fs.existsSync(detailsPath)) {
          const files = fs.readdirSync(detailsPath);
          // pega a primeira imagem encontrada
          const firstImage = files.find(f =>
            /\.(png|jpg|jpeg|gif|webp)$/i.test(f)
          );
          if (firstImage) {
            // retorna caminho relativo para servir via API
            image = `static/${dirent.name}/details/${firstImage}`;
          }
        }
        
        return {
          id: stringToIntId(dirent.name),
          name: dirent.name,
          coverUrl: image
        };
      
      });
      
      res.json(folders);

  } catch (error) {
    res.status(500).json('Erro ao listar clientes');
  }
};