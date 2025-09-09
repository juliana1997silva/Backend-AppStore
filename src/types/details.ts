export interface DetailsType {
  id: number;
  name: string;
  lastmod: string;
  coverUrl: string | null;
  details: string[];
  apkProducao: {
    name: string;
    size: number;
    lastmod: string;
    url: string | null;
  } | null;
  apkHomologacao: {
    name: string;
    size: number;
    lastmod: string;
    url: string | null;
  } | null;
}
