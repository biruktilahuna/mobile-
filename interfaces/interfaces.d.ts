interface Movie {
  id: number;
  title: string;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface TrendingMovie {
  searchTerm: string;
  movie_id: number;
  title: string;
  count: number;
  poster_url: string;
}

interface savedcatagory {
  name: string;
  $id: string;
  $createdAt: string;
}
interface Product {
  title: string;
  description: string;
  price: number;
  stock: integer;
  image: string;
  categoryId: string;
  name: string;
  discount: number;
}
interface page {
  BGimagename: string;
  BGurl: string;
  Logoname: string;
  Logourl: string;
  title: string;
  subtitle: string;
  $id: string;
}

interface orders {
  $id: string;
  Cname: string;
  phoneNO: number;
  status: string;
  total: number;
  $updatedAt: string;
}
interface carts {
  [x: string]: string;
  $id: string;
  Pname: string;
  ProductNo: number;
  image: string;
  orderId: string;
  productId: string;
  $createdAt: string;
  price: number;
}
interface MovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
}

interface SavedmovieProps {
  movie: Savedmovie;
  index: number;
}
