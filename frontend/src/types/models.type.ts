export type Media = {
  id: number;
  name: string;
  path: string;
  score: number;
};

export type Campus = {
  id: number;
  name: string;
  slug: string;
  organisation_id: number;
};

export type Organization = {
  id: number;
  name: string;
  email: string;
  phone: number;
  role: string;
  postcode: number;
  city: string;
  adress: string;
  country: string;
  slug: string;
};

export type Application = {
  id: number;
  title: string;
  type: string;
  logo: string;
  company: string;
  city: string;
  date: string;
  status: string;
  resend: string;
  description: string;
};

export type Promotion = {
  id: number;
  slug: string;
  name: string;
  organisationId: number;
};

export type Speciality = {
  id: number;
  slug: string;
  name: string;
};

export type SubSpeciality = {
  id: number;
  name: string;
  slug: string;
  specialityId: number;
};
