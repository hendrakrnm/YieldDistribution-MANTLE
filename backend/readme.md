SP1 Installation:
- [ ] cargo prove --version returns version number
- [ ] rustc --version shows 1.75.0+
- [ ] ~/projects/sp1/examples/ directory exists

Fibonacci Test:
- [ ] cd ~/projects/sp1/examples/fibonacci works
- [ ] cargo build --release -p fibonacci-program berhasil
- [ ] cargo run --release -p fibonacci-script berhasil
- [ ] Output shows "Proof generated" 
- [ ] Output shows "Proof verified" 

Ready for Day 4:
- [ ] Semua di atas berhasil
- [ ] Understand workflow: compile → prove → verify
- [ ] Siap buat custom SP1 program untuk yield calculation

command run
cargo build --release -p fibonacci-program
time cargo run --release -p fibonacci-script

command bersihin
cd ~/projects/sp1
cargo clean

Intinya dengan kata lain
- Input (n=5): “Hitung 5 langkah fibonacci.”
- Output (a=5, b=8): “Setelah 5 langkah, dua nilai terakhir deret adalah 5 dan 8 (fib(4), fib(5)).”
- Program (guest): logika matematika fibonacci yang jalan di dalam zkVM.
- Script (host): driver yang kasih input, jalankan zkVM, bikin dan verifikasi proof.
- Proof (ZK): bukti bahwa eksekusi program fibonacci dengan input 5 di dalam zkVM memang menghasilkan output (5, 8), tanpa harus mengungkap detail langkah internalnya.
