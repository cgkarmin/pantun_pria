let sukuKataDatabase = {}; // Simpan data suku kata dalam memori

// Fungsi untuk memuatkan CSV
async function loadCSV() {
    try {
        const response = await fetch("db.csv");
        if (!response.ok) throw new Error("Gagal membaca fail CSV.");
        
        const data = await response.text();
        const rows = data.split("\n").map(row => row.split(","));
        
        rows.forEach(row => {
            if (row.length === 2) {
                let perkataan = row[0].trim().toLowerCase();
                let pecahan = row[1].trim();
                sukuKataDatabase[perkataan] = pecahan;
            }
        });

        console.log("Database Suku Kata Dimuatkan!", sukuKataDatabase);
    } catch (error) {
        console.error("Gagal memuatkan fail CSV:", error);
    }
}

// Panggil fungsi untuk muatkan CSV apabila aplikasi mula
loadCSV();

// Fungsi utama untuk pecah suku kata
async function pecahSukuKata() {
    let input = document.getElementById("inputPantun").value.trim();
    if (!input) {
        document.getElementById("output").innerHTML = "Sila masukkan pantun terlebih dahulu!";
        return;
    }

    const baris = input.split("\n");
    let hasil = "<h3>Laporan Analisis:</h3>";

    for (let index = 0; index < baris.length; index++) {
        let barisText = baris[index].trim().replace(/[.,;]+$/, ""); // Buang tanda baca di akhir baris
        if (barisText) {
            hasil += `Baris ${index + 1}: ${barisText}<br>`;
            let perkataan = barisText.split(/\s+/).filter(kata => kata);

            let pecahanBaris = [];
            for (let kata of perkataan) {
                let kataBersih = kata.replace(/[^a-zA-Z]/g, '');

                if (kataBersih in sukuKataDatabase) {
                    pecahanBaris.push(sukuKataDatabase[kataBersih]);
                } else {
                    let pecahanBaru = await tanyaPengguna(kataBersih);
                    sukuKataDatabase[kataBersih] = pecahanBaru;
                    simpanKeCSV(kataBersih, pecahanBaru);
                    pecahanBaris.push(pecahanBaru);
                }
            }
            hasil += `Pecahan: ${pecahanBaris.join(" ")}<br><br>`;
        }
    }

    document.getElementById("output").innerHTML = hasil;
}

// Fungsi untuk bertanya kepada pengguna jika perkataan tiada dalam database
function tanyaPengguna(perkataan) {
    return new Promise((resolve) => {
        let pecahan = prompt(`Perkataan "${perkataan}" tidak ada dalam database. Bagaimana anda mahu pecahkan?`);
        resolve(pecahan ? pecahan : perkataan);
    });
}
