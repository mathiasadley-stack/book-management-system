// Get the HTML elements
const form = document.getElementById("bookForm");
const bookId = document.getElementById("bookId");
const title = document.getElementById("title");
const author = document.getElementById("author");
const price = document.getElementById("price");
const table = document.getElementById("booksTableBody");
const message = document.getElementById("message");
const cancelButton = document.getElementById("cancelButton");

// Show all books in the table
async function showBooks() {
  try {
    const response = await fetch("/books");
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    table.innerHTML = "";
    document.getElementById("bookCount").textContent = result.data.length;

    if (result.data.length === 0) {
      const row = table.insertRow();
      const cell = row.insertCell();
      cell.colSpan = 5;
      cell.textContent = "No books added yet.";
      return;
    }

    for (const book of result.data) {
      const row = table.insertRow();
      row.insertCell().textContent = book.id;
      row.insertCell().textContent = book.title;
      row.insertCell().textContent = book.author;
      row.insertCell().textContent = "₹" + book.price;

      const actionCell = row.insertCell();
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.className = "edit";
      editButton.onclick = function () {
        editBook(book.id);
      };

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete";
      deleteButton.onclick = function () {
        deleteBook(book.id);
      };

      actionCell.appendChild(editButton);
      actionCell.appendChild(deleteButton);
    }
  } catch (error) {
    message.textContent = "Could not load books: " + error.message;
  }
}

// Add a new book or update an existing book
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const book = {
    title: title.value.trim(),
    author: author.value.trim(),
    price: Number(price.value)
  };

  if (!book.title || !book.author || price.value === "" || book.price < 0) {
    message.textContent = "Please fill in all fields correctly.";
    return;
  }

  let url = "/books";
  let method = "POST";

  if (bookId.value !== "") {
    url = "/books/" + bookId.value;
    method = "PUT";
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    resetForm();
    await showBooks();
    message.textContent = result.message;
  } catch (error) {
    message.textContent = error.message;
  }
});

// Fill the form with the selected book's details
async function editBook(id) {
  try {
    const response = await fetch("/books/" + id);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    bookId.value = result.data.id;
    title.value = result.data.title;
    author.value = result.data.author;
    price.value = result.data.price;
    document.getElementById("formHeading").textContent = "Edit Book";
    document.getElementById("submitButton").textContent = "Update Book";
    cancelButton.style.display = "inline-block";
    title.focus();
  } catch (error) {
    message.textContent = error.message;
  }
}

// Delete a book
async function deleteBook(id) {
  if (!confirm("Do you want to delete this book?")) {
    return;
  }

  try {
    const response = await fetch("/book/" + id, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    if (bookId.value === String(id)) {
      resetForm();
    }
    await showBooks();
    message.textContent = result.message;
  } catch (error) {
    message.textContent = error.message;
  }
}

// Clear the form
function resetForm() {
  form.reset();
  bookId.value = "";
  document.getElementById("formHeading").textContent = "Add Book";
  document.getElementById("submitButton").textContent = "Add Book";
  cancelButton.style.display = "none";
}

cancelButton.onclick = resetForm;
document.getElementById("refreshButton").onclick = showBooks;

// Load books when the page opens
showBooks();
