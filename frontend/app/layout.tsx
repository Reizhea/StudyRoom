import './globals.css';

export const metadata = {
  title: 'StudyRoom',
  description: 'Collaborate and Study Effectively!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
