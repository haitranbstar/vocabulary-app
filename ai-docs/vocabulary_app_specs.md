# Ứng Dụng Học Từ Vựng Tiếng Anh - Yêu Cầu Chức Năng (Functional Requirements)

## 1. Quản Lý Chủ Đề & Nhập Liệu (Topic Management & Import)

Tính năng cho phép người dùng tạo chủ đề mới và nạp dữ liệu từ vựng hàng loạt thông qua file Excel.

### Chức năng chi tiết:
* **Tạo chủ đề:**
    * Người dùng nhập tên chủ đề bằng Tiếng Anh (ví dụ: "Business", "Travel").
    * Hệ thống kiểm tra trùng lặp tên chủ đề trước khi tạo.
* **Upload dữ liệu từ vựng:**
    * Hỗ trợ upload file định dạng Excel (`.xlsx`, `.xls`).
    * **Cấu trúc file yêu cầu:** 3 cột dữ liệu bắt buộc:
        1.  English Word (Từ tiếng Anh)
        2.  Vietnamese Meaning (Nghĩa tiếng Việt)
        3.  IPA (Phiên âm quốc tế)
    * Hệ thống thực hiện validate dữ liệu sau khi upload (báo lỗi nếu thiếu cột hoặc file rỗng).
* **Lưu trữ:**
    * Nút **"Lưu"** (Save) để xác nhận và lưu toàn bộ thông tin chủ đề cùng danh sách từ vựng vào cơ sở dữ liệu.

---

## 2. Chi Tiết Chủ Đề (Topic Detail & Vocabulary Management)

Giao diện quản lý danh sách từ vựng trong một chủ đề cụ thể.

### Chức năng chi tiết:
* **Danh sách từ vựng:**
    * Khi click vào một chủ đề, hiển thị danh sách tất cả các từ vựng thuộc chủ đề đó.
* **Chi tiết từ vựng (Word Detail):**
    * Khi click vào một từ cụ thể, hiển thị popup hoặc màn hình chi tiết bao gồm:
        * Nghĩa tiếng Việt.
        * Phiên âm (IPA).
        * **Ví dụ sử dụng:** 01 câu ví dụ chính chứa từ đó.
        * **Giao tiếp hàng ngày:** Tự động hiển thị thêm **05 câu ví dụ** sử dụng từ vựng đó trong ngữ cảnh giao tiếp thực tế.
* **Chỉnh sửa & Xóa:**
    * Cho phép sửa thông tin từ (chính tả, nghĩa, ví dụ).
    * Cho phép xóa từ vựng khỏi danh sách chủ đề.

---

## 3. Flashcard (Thẻ Ghi Nhớ)

Chế độ học từ vựng qua thẻ flashcard tương tác.

### Chức năng chi tiết:
* **Khởi tạo:**
    * Nút **"Tạo Flashcard"**: Hệ thống tự động sinh bộ flashcard từ danh sách từ vựng hiện có của chủ đề.
* **Hiển thị & Tương tác:**
    * **Mặt trước:** Hiển thị Từ tiếng Anh.
    * **Mặt sau:** Hiển thị Nghĩa tiếng Việt.
    * **Thao tác lật:** Click vào thẻ để lật qua lại giữa mặt trước và mặt sau.
* **Tính năng bổ trợ:**
    * **Phát âm (Audio):** Tích hợp biểu tượng loa trên thẻ. Khi bấm vào, hệ thống phát âm thanh chuẩn của từ tiếng Anh.
    * **Điều hướng:** Nút "Next" (Tiếp theo) và "Previous" (Quay lại) để duyệt qua tất cả flashcard trong chủ đề.
    * **Quản lý thẻ:** Người dùng có thể chỉnh sửa nội dung hoặc xóa flashcard ngay trong chế độ xem này nếu phát hiện sai sót.

---

## 4. Bài Tập Ôn Tập (Review Exercises)

Hệ thống tạo bài kiểm tra ngẫu nhiên giúp người dùng củng cố kiến thức.

### Chức năng chi tiết:
* **Khởi tạo bài tập:**
    * Trong màn hình chi tiết chủ đề, nút **"Ôn tập"** sẽ kích hoạt chế độ làm bài tập.
    * Hệ thống lấy ngẫu nhiên các từ trong chủ đề để tạo câu hỏi.
* **Các dạng bài tập:**
    1.  **Trắc nghiệm (Multiple Choice):**
        * Hiển thị từ tiếng Anh.
        * 4 đáp án nghĩa tiếng Việt (1 đúng, 3 sai).
        * Người dùng chọn đáp án đúng.
    2.  **Điền từ (Dictation/Spelling):**
        * Tự động phát âm thanh của từ.
        * Người dùng gõ lại chính xác từ tiếng Anh nghe được.
    3.  **Ghép thẻ (Matching):**
        * Hiển thị 2 cột: Một cột từ tiếng Anh, một cột nghĩa tiếng Việt (đã bị xáo trộn).
        * Người dùng kéo thả hoặc chọn cặp từ - nghĩa tương ứng để ghép đôi.
* **Kết quả:** Hiển thị điểm số hoặc số câu đúng/sai sau khi hoàn thành bài tập.