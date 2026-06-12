import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";

const genres = ["All", "Fiction", "Non-Fiction", "Fantasy", "Mystery", "Thriller", "Romance", "Science Fiction", "Dystopian", "Classic", "Biography"];

const AvailabilityBadge = ({ book }) => {
  if (book.availableCopies === 0)
    return <span className="badge-issued">Fully Issued</span>;
  if (book.availableCopies <= 1)
    return <span className="badge-pending">{book.availableCopies} left</span>;
  return <span className="badge-available">{book.availableCopies} Available</span>;
};

const BookCard = ({ book, onRequest, isStudent, myRequests }) => {
  const [imgError, setImgError] = useState(false);
  const alreadyRequested = myRequests?.some(
    (r) => r.bookId === book.id && (r.status === "pending" || r.status === "approved")
  );

  const placeholderColors = [
    "from-purple-900 to-indigo-900",
    "from-indigo-900 to-blue-900",
    "from-violet-900 to-purple-900",
    "from-blue-900 to-cyan-900",
    "from-fuchsia-900 to-purple-900",
  ];
  const colorClass = placeholderColors[parseInt(book.id.replace(/\D/g, ""), 10) % placeholderColors.length];

  return (
    <div className="book-card group animate-fade-in">
      {/* Cover */}
      <div className="relative h-52 overflow-hidden">
        {book.cover && !imgError ? (
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${colorClass} flex flex-col items-center justify-center p-4`}>
            <div className="text-5xl mb-2">📖</div>
            <p className="text-white/70 text-xs text-center font-medium leading-tight">{book.title}</p>
          </div>
        )}
        {/* Genre badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm" style={{ background: "rgba(99,102,241,0.75)", color: "white" }}>
            {book.genre}
          </span>
        </div>
        {/* Available copies overlay */}
        <div className="absolute top-3 right-3">
          <AvailabilityBadge book={book} />
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-bold text-white text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary-300 transition-colors">
          {book.title}
        </h3>
        <p className="text-gray-400 text-sm mb-1">{book.author}</p>
        {book.publishedYear && (
          <p className="text-gray-600 text-xs mb-3">{book.publishedYear}</p>
        )}
        {book.description && (
          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{book.description}</p>
        )}

        {/* Copies progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Availability</span>
            <span>{book.availableCopies}/{book.totalCopies}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(book.availableCopies / book.totalCopies) * 100}%`,
                background: book.availableCopies === 0
                  ? "rgba(239,68,68,0.8)"
                  : book.availableCopies <= 1
                  ? "rgba(245,158,11,0.8)"
                  : "rgba(16,185,129,0.8)",
              }}
            />
          </div>
        </div>

        {/* Action */}
        {isStudent && (
          <button
            onClick={() => onRequest(book.id)}
            disabled={book.availableCopies === 0 || alreadyRequested}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              alreadyRequested
                ? "text-yellow-400 cursor-not-allowed"
                : book.availableCopies === 0
                ? "text-gray-500 cursor-not-allowed"
                : "btn-primary"
            }`}
            style={
              alreadyRequested
                ? { background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)" }
                : book.availableCopies === 0
                ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }
                : {}
            }
          >
            {alreadyRequested ? "⏳ Requested" : book.availableCopies === 0 ? "📵 Unavailable" : "📚 Request Issue"}
          </button>
        )}
      </div>
    </div>
  );
};

const LibraryCatalog = () => {
  const { books, currentUser, requestIssue, issueRequests } = useApp();
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [viewMode, setViewMode] = useState("grid"); // grid | list

  const isStudent = currentUser?.type === "student";
  const myRequests = isStudent
    ? issueRequests.filter((r) => r.studentId === currentUser.id)
    : [];

  const filteredBooks = useMemo(() => {
    let result = books.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn?.toLowerCase().includes(search.toLowerCase());
      const matchGenre = selectedGenre === "All" || b.genre === selectedGenre;
      return matchSearch && matchGenre;
    });

    result.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      if (sortBy === "available") return b.availableCopies - a.availableCopies;
      if (sortBy === "year") return (b.publishedYear || 0) - (a.publishedYear || 0);
      return 0;
    });
    return result;
  }, [books, search, selectedGenre, sortBy]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="blob w-96 h-96 opacity-8 pointer-events-none" style={{ background: "#4f46e5", top: "0", right: "-120px" }} />
      <div className="blob w-64 h-64 opacity-6 pointer-events-none" style={{ background: "#d946ef", bottom: "20%", left: "-60px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display font-bold text-3xl text-white">Library Catalog</h1>
          <p className="text-gray-400 mt-1">
            Discover and request from <span className="text-primary-400 font-semibold">{books.length} books</span> in our collection
          </p>
        </div>

        {/* Search & Filters */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-11"
                placeholder="Search by title, author, or ISBN..."
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input sm:w-40"
            >
              <option value="title">Sort: Title</option>
              <option value="author">Sort: Author</option>
              <option value="available">Sort: Available</option>
              <option value="year">Sort: Year</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center gap-1 glass-card p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "text-white bg-primary-600" : "text-gray-500 hover:text-white"}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "text-white bg-primary-600" : "text-gray-500 hover:text-white"}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>

          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  selectedGenre === g
                    ? "text-white bg-primary-600 shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
                style={selectedGenre !== g ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" } : {}}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-gray-500 text-sm">
            Showing <span className="text-white font-medium">{filteredBooks.length}</span> books
            {search && <span className="text-primary-400"> for "{search}"</span>}
          </p>
        </div>

        {/* Books Grid/List */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            <button onClick={() => { setSearch(""); setSelectedGenre("All"); }} className="btn-secondary mt-4">Clear Filters</button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isStudent={isStudent}
                myRequests={myRequests}
                onRequest={(bookId) => requestIssue(bookId, currentUser.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBooks.map((book) => {
              const alreadyRequested = myRequests.some(
                (r) => r.bookId === book.id && (r.status === "pending" || r.status === "approved")
              );
              return (
                <div
                  key={book.id}
                  className="glass-card rounded-2xl p-4 flex gap-4 items-center transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/40"
                >
                  <div className="w-12 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "rgba(99,102,241,0.15)" }}>
                    {book.cover ? (
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">📖</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-white truncate">{book.title}</h3>
                        <p className="text-sm text-gray-400">{book.author}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {book.availableCopies === 0
                          ? <span className="badge-issued">Fully Issued</span>
                          : book.availableCopies <= 1
                          ? <span className="badge-pending">{book.availableCopies} left</span>
                          : <span className="badge-available">Available</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>{book.genre}</span>
                      {book.publishedYear && <span className="text-xs text-gray-600">{book.publishedYear}</span>}
                    </div>
                  </div>
                  {isStudent && (
                    <button
                      onClick={() => requestIssue(book.id, currentUser.id)}
                      disabled={book.availableCopies === 0 || alreadyRequested}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                        alreadyRequested ? "text-yellow-400 cursor-not-allowed" : book.availableCopies === 0 ? "text-gray-500 cursor-not-allowed" : "btn-primary"
                      }`}
                      style={
                        alreadyRequested ? { background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)" }
                        : book.availableCopies === 0 ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" } : {}
                      }
                    >
                      {alreadyRequested ? "⏳ Requested" : book.availableCopies === 0 ? "Unavailable" : "Request"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryCatalog;
