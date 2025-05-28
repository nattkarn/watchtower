import Swal from "sweetalert2";

export const config = {
  apiUrl: "http://localhost:5000",
  tokenKey: "myAwesomeApp",
  allowOrigin: "*",
  allowMethods: "GET, POST, PUT, DELETE, OPTIONS",
  allowOrigins: ["http://localhost:3000"],
  confirmDialog: () => {
    return Swal.fire({
      title: "คุณแน่ใจนะที่จะลบข้อมูลนี้?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      reverseButtons: true,
      customClass: {
        title: "custom-title-class",
        htmlContainer: "custom-text-class",
        confirmButton: "custom-confirm-button-class",
      },
    });
  },
  showSuccessToast: (message: string) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  },
};

export default config;
