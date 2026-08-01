-- Menambahkan Dummy Data Pengalaman
INSERT INTO public.portfolio_items (type, title, position, description, link, image)
VALUES 
(
    'pengalaman',
    'Juara 1 Web Design Competition',
    'Ketua Tim & Frontend Developer',
    'Memimpin tim untuk merancang dan membangun website edukatif responsif menggunakan React dan Tailwind CSS dalam perlombaan tingkat nasional.',
    'https://github.com/adityarajadana',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'
),
(
    'pengalaman',
    'Internship Game Developer',
    'Programmer Magang',
    'Membantu mengembangkan mekanik game dan mengoptimalkan performa rendering di Unity Engine untuk sebuah game indie.',
    'https://github.com/adityarajadana',
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80'
);

-- Menambahkan Dummy Data Sertifikat
INSERT INTO public.portfolio_items (type, title, position, description, link, image)
VALUES 
(
    'sertifikat',
    'Sertifikasi Dicoding: Menjadi Front-End Web Developer Expert',
    'Lulusan Terbaik',
    'Mempelajari Progressive Web Apps (PWA), optimasi performa web, dan testing. Berhasil membangun aplikasi restoran offline-first.',
    'https://dicoding.com',
    'https://images.unsplash.com/photo-1589330694653-06defb546b34?w=800&q=80'
),
(
    'sertifikat',
    'AWS Certified Cloud Practitioner',
    'Peserta Ujian',
    'Sertifikasi dasar mengenai layanan Amazon Web Services, arsitektur cloud, dan keamanan cloud.',
    'https://aws.amazon.com',
    'https://images.unsplash.com/photo-1516245834210-c4c142715d2e?w=800&q=80'
);
