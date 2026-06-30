let allData = {
  documents: [],
  interviews: [],
  gallery: []
};


loadData();

async function loadData() {
  const response = await fetch('./data.json')
  const data = await response.json()
  allData = data
  startPageWork()
}

function startPageWork() {
  if (document.getElementById("documentsContainer")) {
    showDocuments(allData.documents);
  }

  if (document.getElementById("interviewsContainer")) {
    showInterviews(allData.interviews);
  }

  if (document.getElementById("galleryContainer")) {
    showGallery(allData.gallery);
  }

  if (document.getElementById("contactForm")) {
    setupContactForm();
  }
}

function showDocuments(documents) {
  const container = document.getElementById("documentsContainer");
  container.innerHTML = "";

  documents.forEach(function (doc) {
    container.innerHTML += `
      <article class="card bg-base-100 shadow">
        <div class="card-body">
          <div class="badge badge-primary">${doc.category}</div>
          <h2 class="card-title">${doc.title}</h2>
          <p><strong>Date:</strong> ${doc.date}</p>
          <p>${doc.description}</p>
          <p><strong>Source:</strong> ${doc.source}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-sm btn-outline btn-primary" onclick="showDocumentDetails(${doc.id})">View Details</button>
          </div>
        </div>
      </article>
    `;
  });
}

function filterDocuments(category) {
  if (category === "All") {
    showDocuments(allData.documents);
  } else {
    const filteredDocuments = allData.documents.filter(function (doc) {
      return doc.category === category;
    });
    showDocuments(filteredDocuments);
  }
}

function showDocumentDetails(id) {
  const documentItem = allData.documents.find(function (doc) {
    return doc.id === id;
  });

  document.getElementById("modalTitle").innerText = documentItem.title;
  document.getElementById("modalCategory").innerText = "Category: " + documentItem.category;
  document.getElementById("modalDate").innerText = "Date: " + documentItem.date;
  document.getElementById("modalSource").innerText = "Source: " + documentItem.source;
  document.getElementById("modalDescription").innerText = documentItem.description;
  document.getElementById("documentModal").showModal();
}

function showInterviews(interviews) {
  const container = document.getElementById("interviewsContainer");
  container.innerHTML = "";

  interviews.forEach(function (interview) {
    let mediaBox = "";

    // If media type is Audio, show audio player
    if (interview.mediaType === "Audio") {
      mediaBox = `
        <div class="bg-base-200 rounded-lg p-5 mt-3">
          <p class="font-semibold mb-3">Audio Interview</p>
          <audio controls class="w-full">
            <source src="${interview.audioUrl}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        </div>
      `;
    }

    // If media type is Video, show YouTube video
    else if (interview.mediaType === "Video") {
      mediaBox = `
        <div class="bg-base-200 rounded-lg p-5 mt-3">
          <p class="font-semibold mb-3">Video Interview</p>
          <div class="aspect-video">
            <iframe 
              class="w-full h-full rounded-lg"
              src="${interview.videoUrl}" 
              title="${interview.name} Interview"
              allowfullscreen>
            </iframe>
          </div>
        </div>
      `;
    }

    // If no media is found
    else {
      mediaBox = `
        <div class="bg-base-200 rounded-lg p-5 mt-3 text-center">
          <p class="font-semibold">Media not available</p>
        </div>
      `;
    }

    container.innerHTML += `
      <article class="card bg-base-100 shadow">
        <div class="card-body">
          <div class="badge badge-secondary">${interview.role}</div>
          <h2 class="card-title">${interview.name}</h2>
          <p><strong>Biography:</strong> ${interview.biography}</p>
          <p><strong>Interview Summary:</strong> ${interview.summary}</p>
          ${mediaBox}
        </div>
      </article>
    `;
  });
}

function showGallery(photos) {
  const container = document.getElementById("galleryContainer");
  container.innerHTML = "";

  photos.forEach(function (photo) {
    container.innerHTML += `
      <article class="card bg-base-100 shadow">
        <figure><img src="${photo.image}" alt="${photo.title}" class="h-56 w-full object-cover"></figure>
        <div class="card-body">
          <div class="badge badge-accent">${photo.category}</div>
          <h2 class="card-title">${photo.title}</h2>
          <p>${photo.description}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-sm btn-outline btn-primary" onclick="zoomImage(${photo.id})">Zoom</button>
            <a class="btn btn-sm btn-primary" href="${photo.image}" target="_blank" download>Download</a>
          </div>
        </div>
      </article>
    `;
  });
}

function filterGallery(category) {
  if (category === "All") {
    showGallery(allData.gallery);
  } else {
    const filteredPhotos = allData.gallery.filter(function (photo) {
      return photo.category === category;
    });
    showGallery(filteredPhotos);
  }
}

function zoomImage(id) {
  const photo = allData.gallery.find(function (item) {
    return item.id === id;
  });

  document.getElementById("imageModalTitle").innerText = photo.title;
  document.getElementById("imageModalPhoto").src = photo.image;
  document.getElementById("imageModalDescription").innerText = photo.description;
  document.getElementById("imageModal").showModal();
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const messageBox = document.getElementById("formMessage");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name === "" || email === "" || subject === "" || message === "") {
      messageBox.innerText = "Please fill in all required fields.";
      messageBox.className = "text-sm font-semibold text-error";
      return;
    }

    if (!email.includes("@")) {
      messageBox.innerText = "Please enter a valid email address.";
      messageBox.className = "text-sm font-semibold text-error";
      return;
    }

    messageBox.innerText = "Your message has been submitted successfully.";
    messageBox.className = "text-sm font-semibold text-success";
    form.reset();
  });
}
