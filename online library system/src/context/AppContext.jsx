import React, { createContext, useContext, useState, useCallback } from "react";
import {
  initialBooks,
  initialStudents,
  initialIssueRequests,
  adminCredentials,
} from "../data/mockData";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [books, setBooks] = useState(initialBooks);
  const [students] = useState(initialStudents);
  const [issueRequests, setIssueRequests] = useState(initialIssueRequests);
  const [currentUser, setCurrentUser] = useState(null); // { type: 'admin'|'student', ...data }
  const [notifications, setNotifications] = useState([]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const loginAdmin = (email, password) => {
    if (
      email === adminCredentials.email &&
      password === adminCredentials.password
    ) {
      setCurrentUser({ type: "admin", ...adminCredentials });
      return true;
    }
    return false;
  };

  const loginStudent = (email, password) => {
    const student = students.find(
      (s) => s.email === email && s.password === password
    );
    if (student) {
      setCurrentUser({ type: "student", ...student });
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  // ── Notifications ─────────────────────────────────────────────────────────
  const addNotification = useCallback((message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3500);
  }, []);

  // ── Books ─────────────────────────────────────────────────────────────────
  const addBook = (book) => {
    const newBook = {
      ...book,
      id: `b${Date.now()}`,
      availableCopies: Number(book.totalCopies),
      totalCopies: Number(book.totalCopies),
    };
    setBooks((prev) => [newBook, ...prev]);
    addNotification(`"${book.title}" added successfully!`);
  };

  const removeBook = (bookId) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    setIssueRequests((prev) =>
      prev.filter((r) => r.bookId !== bookId)
    );
    addNotification("Book removed.", "info");
  };

  // ── Issue Requests ────────────────────────────────────────────────────────
  const requestIssue = (bookId, studentId) => {
    const alreadyRequested = issueRequests.some(
      (r) =>
        r.bookId === bookId &&
        r.studentId === studentId &&
        (r.status === "pending" || r.status === "approved")
    );
    if (alreadyRequested) {
      addNotification("You already have an active request for this book.", "error");
      return;
    }
    const book = books.find((b) => b.id === bookId);
    if (!book || book.availableCopies === 0) {
      addNotification("No copies available.", "error");
      return;
    }
    const newRequest = {
      id: `req${Date.now()}`,
      bookId,
      studentId,
      requestDate: new Date().toISOString().split("T")[0],
      status: "pending",
      dueDate: null,
      issueDate: null,
      returnDate: null,
    };
    setIssueRequests((prev) => [newRequest, ...prev]);
    addNotification("Issue request submitted!");
  };

  const approveRequest = (requestId) => {
    setIssueRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        const issueDate = new Date().toISOString().split("T")[0];
        const due = new Date();
        due.setDate(due.getDate() + 14);
        return {
          ...r,
          status: "approved",
          issueDate,
          dueDate: due.toISOString().split("T")[0],
        };
      })
    );
    setBooks((prev) =>
      prev.map((b) => {
        const req = issueRequests.find((r) => r.id === requestId);
        if (req && b.id === req.bookId) {
          return { ...b, availableCopies: Math.max(0, b.availableCopies - 1) };
        }
        return b;
      })
    );
    addNotification("Request approved!");
  };

  const rejectRequest = (requestId) => {
    setIssueRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: "rejected" } : r
      )
    );
    addNotification("Request rejected.", "info");
  };

  const markReturned = (requestId) => {
    const req = issueRequests.find((r) => r.id === requestId);
    setIssueRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "returned", returnDate: new Date().toISOString().split("T")[0] }
          : r
      )
    );
    if (req) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === req.bookId
            ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) }
            : b
        )
      );
    }
    addNotification("Book marked as returned!");
  };

  // ── Computed helpers ──────────────────────────────────────────────────────
  const getBookById = (id) => books.find((b) => b.id === id);
  const getStudentById = (id) => students.find((s) => s.id === id);
  const getRequestsForStudent = (studentId) =>
    issueRequests.filter((r) => r.studentId === studentId);

  const stats = {
    totalBooks: books.length,
    totalCopies: books.reduce((a, b) => a + b.totalCopies, 0),
    issuedBooks: books.reduce(
      (a, b) => a + (b.totalCopies - b.availableCopies),
      0
    ),
    pendingRequests: issueRequests.filter((r) => r.status === "pending").length,
    totalStudents: students.length,
  };

  return (
    <AppContext.Provider
      value={{
        books,
        students,
        issueRequests,
        currentUser,
        notifications,
        stats,
        loginAdmin,
        loginStudent,
        logout,
        addBook,
        removeBook,
        requestIssue,
        approveRequest,
        rejectRequest,
        markReturned,
        getBookById,
        getStudentById,
        getRequestsForStudent,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
