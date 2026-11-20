
import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
    guardPage,
    setupShell,
    esc,
    fmt
} from "./common.js";


guardPage(async (user, profile) => {

    setupShell();

    // Check whether the logged-in user is an admin
    if (profile.role !== "admin") {

        document.querySelector("#admin-content").innerHTML = `
            <div class="card">
                <h2>Access denied</h2>
                <p class="muted">
                    This page is only for administrators.
                </p>
            </div>
        `;

        return;
    }

    try {

        // Fetch all four collections from Firestore
        const [users, messages, posts, reports] =
            await Promise.all([

                getDocs(collection(db, "users")),
                getDocs(collection(db, "messages")),
                getDocs(collection(db, "posts")),
                getDocs(collection(db, "reports"))

            ]);


        // Update dashboard statistics
        document.querySelector("#users-count").textContent =
            users.size;

        document.querySelector("#messages-count").textContent =
            messages.size;

        document.querySelector("#posts-count").textContent =
            posts.size;


        // Count pending reports
        const pendingReports = reports.docs.filter(
            report => report.data().status === "pending"
        );

        document.querySelector("#reports-count").textContent =
            pendingReports.length;


        // Display reports in the table
        const reportsTable = document.querySelector("#reports");

        reportsTable.innerHTML = reports.docs.map(report => {

            const data = report.data();

            return `
                <tr>
                    <td>${esc(data.name || "User")}</td>

                    <td>${esc(data.reason || "Not specified")}</td>

                    <td>${fmt(data.createdAt)}</td>

                    <td>${esc(data.status || "pending")}</td>

                    <td>
                        ${
                            data.status === "pending"
                            ? `<button
                                class="btn secondary dismiss"
                                data-id="${report.id}">
                                Dismiss
                               </button>`
                            : "—"
                        }
                    </td>
                </tr>
            `;

        }).join("") || `
            <tr>
                <td colspan="5">No reports.</td>
            </tr>
        `;


        // Add click events to Dismiss buttons
        document.querySelectorAll(".dismiss").forEach(button => {

            button.addEventListener("click", async () => {

                try {

                    await updateDoc(
                        doc(db, "reports", button.dataset.id),
                        {
                            status: "dismissed"
                        }
                    );

                    alert("Report dismissed successfully!");

                    location.reload();

                } catch (error) {

                    console.error("Dismiss error:", error);

                    alert("Could not dismiss the report.");

                }

            });

        });


    } catch (error) {

        console.error("Admin dashboard error:", error);

        document.querySelector("#admin-content").innerHTML = `
            <div class="card">
                <h2>Could not load dashboard</h2>
                <p class="muted">
                    Check your Firebase permissions and browser console.
                </p>
            </div>
        `;

    }

});
