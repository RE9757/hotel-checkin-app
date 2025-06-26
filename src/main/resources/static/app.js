let editingRecordId = null;

function populateFormFromURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.has("name")) document.getElementById("name").value = params.get("name");
    if (params.has("roomNumber")) document.getElementById("roomNumber").value = params.get("roomNumber");
    if (params.has("checkInDate")) document.getElementById("checkInDate").value = params.get("checkInDate");
    if (params.has("checkOutDate")) document.getElementById("checkOutDate").value = params.get("checkOutDate");
    if (params.has("price")) document.getElementById("price").value = params.get("price");
    if (params.has("notes")) document.getElementById("notes").value = params.get("notes");
}

function submitForm(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const roomNumber = parseInt(document.getElementById("roomNumber").value);
    const checkInDate = document.getElementById("checkInDate").value;
    const checkOutDate = document.getElementById("checkOutDate").value;
    const price = parseFloat(document.getElementById("price").value);
    const notes = document.getElementById("notes").value;

    if (!name || isNaN(roomNumber) || !checkInDate || !checkOutDate || isNaN(price)) {
        alert("Please fill in all required fields correctly.");
        return;
    }

    if (roomNumber < 100) {
        alert("Room number must be at least 100.");
        return;
    }

    if (price < 0) {
        alert("Price cannot be negative.");
        return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkOut <= checkIn) {
        alert("Check-out date must be after check-in date.");
        return;
    }

    const payload = { name, roomNumber, checkInDate, checkOutDate, price, notes };

    const url = editingRecordId !== null ? `/api/checkin/${editingRecordId}` : `/api/checkin`;
    const method = editingRecordId !== null ? "PUT" : "POST";

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(async response => {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Server error");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("result").textContent =
            `Check-in ${editingRecordId ? "updated" : "successful"} for ${data.name} (Room ${data.roomNumber})`;
        editingRecordId = null;
        document.getElementById("checkin-form").reset();
        loadCheckInRecords();
    })
    .catch(error => {
        document.getElementById("result").textContent = "Check-in failed: " + error.message;
    });
}

function loadCheckInRecords() {
    const container = document.getElementById("records");
    const btn = document.getElementById("loadBtn");

    // If records table is already shown → collapse it
    if (container.innerHTML.trim() !== "") {
        container.innerHTML = "";
        btn.textContent = "Show Check-in Records";
        return;
    }

    // Fetch and display records
    fetch("/api/checkin/records")
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch records");
            return res.json();
        })
        .then(data => {
            renderRecordsTable(data);
            btn.textContent = "Hide Check-in Records";  // Update button text only after successful load
        })
        .catch(error => {
            container.textContent = "Error loading records: " + error.message;
        });
}

function renderRecordsTable(records) {
    const table = document.createElement("table");
    table.className = "table table-bordered table-striped w-100";

    const headerRow = document.createElement("tr");
    ["Name", "Room", "Check-in", "Check-out", "Price", "Notes", "Actions"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    records.forEach(record => {
        const row = document.createElement("tr");

        const name = document.createElement("td");
        name.textContent = record.name;

        const room = document.createElement("td");
        room.textContent = record.roomNumber;

        const checkIn = document.createElement("td");
        checkIn.textContent = record.checkInDate;

        const checkOut = document.createElement("td");
        checkOut.textContent = record.checkOutDate;

        const price = document.createElement("td");
        price.textContent = record.price;

        const notes = document.createElement("td");
        notes.textContent = record.notes || "";
        notes.style.textAlign = "center";

        const actions = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "btn btn-sm btn-outline-primary me-2";
        editBtn.onclick = (e) => {
            e.currentTarget.blur();
            fillFormWithRecord(record);
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "btn btn-sm btn-outline-danger";
        deleteBtn.onclick = (e) => {
            e.currentTarget.blur();
            deleteRecord(record.id);
        }

        actions.append(editBtn, deleteBtn);

        row.append(name, room, checkIn, checkOut, price, notes, actions);
        table.appendChild(row);
    });

    const container = document.getElementById("records");
    container.innerHTML = "";
    container.appendChild(table);
}

function fillFormWithRecord(record) {
    editingRecordId = record.id;

    document.getElementById("name").value = record.name;
    document.getElementById("roomNumber").value = record.roomNumber;
    document.getElementById("checkInDate").value = record.checkInDate;
    document.getElementById("checkOutDate").value = record.checkOutDate;
    document.getElementById("price").value = record.price;
    document.getElementById("notes").value = record.notes || "";
    document.getElementById("result").textContent = "Editing record ID: " + record.id;
}

function deleteRecord(id) {
    if (!confirm("Are you sure you want to delete this record?")) return;

    fetch(`/api/checkin/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        return res.text();
    })
    .then(() => {
        loadCheckInRecords();
        document.getElementById("result").textContent = "Record deleted.";
    })
    .catch(err => {
        document.getElementById("result").textContent = "Error deleting record: " + err.message;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    populateFormFromURL();
    document.getElementById("checkin-form").addEventListener("submit", submitForm);
    document.getElementById("loadBtn").addEventListener("click", loadCheckInRecords);
});
