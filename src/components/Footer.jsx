const Footer = () => {
  return (
    <footer className="mt-10 bg-white/70 backdrop-blur border-t">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
        SoonIPO surfaces public data to help investors follow past and
        forthcoming initial public offerings across global exchanges. All
        figures are provided “as-is” without warranty.
        <br />
        © {new Date().getFullYear()} SoonIPO.com. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
