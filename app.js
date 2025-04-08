// Select form and book list elements
const bookForm = document.getElementById("book-form");
const availableBooksList = document.getElementById("books-available");
const borrowedBooksList = document.getElementById("books-borrowed");

// Arrays to store books
let availableBooks = JSON.parse(localStorage.getItem("availableBooks")) || [];
let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

// Display books on page load
displayBooks();

// Add a book to the available list
bookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const cover = document.getElementById("cover").files[0];

    if (!title || !author || !cover) {
        alert("Please fill in all fields and select a cover image.");
        return;
    }

    // Simpan metadata saja
    const book = { title, author, coverName: cover.name };

    // Add the book to the availableBooks array
    availableBooks.push(book);
    saveBooks();

    // Simpan file cover secara lokal
    const fileReader = new FileReader();
    fileReader.onload = function () {
        // Simpan URL untuk menampilkan gambar
        localStorage.setItem(cover.name, fileReader.result);
        displayBooks();
    };
    fileReader.readAsDataURL(cover);

    bookForm.reset();
});

// Display books on the page
function displayBooks() {
    availableBooksList.innerHTML = "";
    borrowedBooksList.innerHTML = "";

    availableBooks.forEach((book, index) => {
        const coverURL = localStorage.getItem(book.coverName);
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${coverURL}" alt="${book.title} Cover">
            <div>
                <strong>${book.title}</strong> by ${book.author}
            </div>
            <div class="book-actions">
                <button class="borrow" onclick="borrowBook(${index})">Borrow</button>
                <button class="delete" onclick="deleteBook('available', ${index})">Delete</button>
            </div>
        `;
        availableBooksList.appendChild(li);
    });
    

    borrowedBooks.forEach((book, index) => {
        const coverURL = localStorage.getItem(book.coverName);
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${coverURL}" alt="${book.title} Cover">
            <div>
                <strong>${book.title}</strong> by ${book.author}
            </div>
            <div class="book-actions">
                <button onclick="returnBook(${index})">Return</button>
                <button class="delete" onclick="deleteBook('borrowed', ${index})">Delete</button>
            </div>
        `;
        borrowedBooksList.appendChild(li);
    });
}

// Function to borrow a book
function borrowBook(index) {
    const book = availableBooks.splice(index, 1)[0];
    borrowedBooks.push(book);
    saveBooks();
    displayBooks();
}

// Function to return a book
function returnBook(index) {
    const book = borrowedBooks.splice(index, 1)[0];
    availableBooks.push(book);
    saveBooks();
    displayBooks();
}

// Function to delete a book
function deleteBook(listType, index) {
    if (listType === 'available') {
        // Delete book from the availableBooks array
        availableBooks.splice(index, 1);
        localStorage.setItem("availableBooks", JSON.stringify(availableBooks));
    } else if (listType === 'borrowed') {
        // Delete book from the borrowedBooks array
        borrowedBooks.splice(index, 1);
        localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
    }

    // After deleting, update the display
    displayBooks();
}

// Function to save books to localStorage
function saveBooks() {
    localStorage.setItem("availableBooks", JSON.stringify(availableBooks));
    localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
}
