import { Request, Response } from "express";
import fs, { Dirent } from "fs";
import path from "path";
import { BASE_FOLDER } from "..";
import { stringToIntId } from "../utils/stringToIntId";

export async function details(req: Request, res: Response): Promise<void> {
  try {
    const nameFolder = req.params.name;
    const motherPath = path.join(BASE_FOLDER, nameFolder);

    if (!fs.existsSync(motherPath) || !fs.statSync(motherPath).isDirectory()) {
      res.status(404).json({ error: "Pasta não encontrada" });
    }

    const detailsPath = path.join(motherPath, "details");
    let firstImage = null;
    if (fs.existsSync(detailsPath)) {
      const images = fs
        .readdirSync(detailsPath, { withFileTypes: true })
        .filter(
          (dirent) =>
            dirent.isFile() && /\.(jpe?g|png|gif|webp)$/i.test(dirent.name)
        )
        .map((dirent) => `static/${nameFolder}/details/${dirent.name}`);

      if (images.length > 0) {
        firstImage = images[0];
      }
    }

    // Lista pastas filhas (Debug, Release)
    const childFolders = fs
      .readdirSync(motherPath, { withFileTypes: true })
      .filter(
        (dirent) =>
          dirent.isDirectory() &&
          (dirent.name === "debug" || dirent.name === "release")
      )
      .map((dirent) => dirent.name);

    //Apk Debug
    let apkDebug = null;
    if (childFolders.includes("debug")) {
      const debugPath = path.join(motherPath, "debug");
      const debugApk = fs
        .readdirSync(debugPath, { withFileTypes: true })
        .find(
          (dirent) =>
            dirent.isFile() &&
            dirent.name.endsWith(".apk") &&
            dirent.name.toLowerCase().includes("armeabi-v7a")
        );

      if (debugApk) {
        const filePath = path.join(debugPath, debugApk.name);
        const stats = fs.statSync(filePath);
        apkDebug = {
          name: debugApk.name,
          size: stats.size,
          lastmod: stats.mtime,
          url: `static/${nameFolder}/debug/${debugApk.name}`,
        };
      }
    }

    //Apk Release
    let apkRelease = null;
    if (childFolders.includes("release")) {
      const releasePath = path.join(motherPath, "release");
      const releaseApk = fs
        .readdirSync(releasePath, { withFileTypes: true })
        .find(
          (dirent) =>
            dirent.isFile() &&
            dirent.name.endsWith(".apk") &&
            dirent.name.toLowerCase().includes("armeabi-v7a")
        );

      if (releaseApk) {
        const filePath = path.join(releasePath, releaseApk.name);
        const stats = fs.statSync(filePath);
        apkRelease = {
          name: releaseApk.name,
          size: stats.size,
          lastmod: stats.mtime,
          url: `static/${nameFolder}/release/${releaseApk.name}`,
        };
      }
    }

    //Screens
    const screenFolder = path.join(motherPath, "details", "screen");
    let imageLinks: string[] = [];
    if (fs.existsSync(screenFolder)) {
      imageLinks = fs
        .readdirSync(screenFolder, { withFileTypes: true })
        .filter(
          (dirent) =>
            dirent.isFile() && /\.(jpe?g|png|gif|webp)$/i.test(dirent.name)
        )
        .map((dirent) => `static/${nameFolder}/details/screen/${dirent.name}`);
    }

    const response = {
      id: stringToIntId(nameFolder),
      name: nameFolder,
      coverUrl: firstImage,
      details: imageLinks,
      apkHomologacao: apkDebug ? apkDebug : null,
      apkProducao: apkRelease ? apkRelease : null,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json("Erro ao listar os detalhes do cliente desejado");
  }
}
