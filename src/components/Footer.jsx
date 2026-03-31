import { connection } from "next/server";

export default async function Footer() {
  await connection();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground md:px-8">
        SoonIPO surfaces public data to help investors follow past and
        forthcoming initial public offerings across global exchanges. All
        figures are provided as-is without warranty.
        <br />
        © {year} SoonIPO.com. All rights reserved.
      </div>
    </footer>
  );
}
