import pdfMake from "pdfmake/build/pdfmake";
import { logo } from "../../../../assets/img";
import { Producto } from "../models/product/entities/Producto";
import { CartService } from "../models/product/services/cart.service";

const generatePDF = (
  products: Producto[],
  fecha: string,
  cartService: CartService
) => {
  const productsPerPage = 1;
  const pages = [];

  // Cargar las imágenes de los productos
  const images = products.reduce((acc, product, index) => {
    acc[`image${index}_1`] = `http://localhost:3000/tiaras/api/uploads/${product.imagenes?.[0]}`;
    acc[`image${index}_2`] = `http://localhost:3000/tiaras/api/uploads/${product.imagenes?.[1] || product.imagenes?.[0]}`; // Segunda imagen o repetir la primera
    return acc;
  }, {});

  for (let i = 0; i < products.length; i += productsPerPage) {
    const product = products[i];

    pages.push({
      stack: [
        // Encabezado con logo y fecha
        {
          columns: [
            { image: logo.miVar, width: 100 },
            {
              stack: [
                { text: `Fecha: ${fecha} | Qr to Instagram`, style: "subheader", alignment: "right" },
                {
                  qr: "https://www.instagram.com/tiarascol/",
                  fit: 80,
                  alignment: "right",
                  margin: [0, 10, 0, 10],
                },
              ],
            },
          ],
        },
        { text: "\n" },

        // Contenido del producto
        {
          columns: [
            // Imágenes del producto
            {
              stack: [
                { image: `image${i}_1`, width: 300, height: 300, margin: [10, 10, 10, 10] },
                ],
                alignment: "center",
            },
            // Información del producto
            {
                stack: [
                    { image: `image${i}_2`, width: 150, height: 150, alignment:"center", margin: [10, 10, 10, 10] },
                    { text: product.nombre, style: "productTitle", alignment: "center" },
                    { text: product.descripcion, style: "texto", alignment: "justify", margin: [0, 10] },
                    { text: `Precio: $${product.precio}`, style: "precio", alignment: "center", margin: [0, 10] },
                ],
                width: "auto",
            },
          ],
          columnGap: 20,
        },
      ],
      pageBreak: i + productsPerPage < products.length ? "after" : undefined, // Salto de página
    });
  }

  const styles = {
    header: {
      fontSize: 16,
      bold: true,
    },
    subheader: {
      fontSize: 12,
      margin: [0, 5, 0, 5],
    },
    productTitle: {
      fontSize: 18,
      bold: true,
      color: "#490D0B",
    },
    texto: {
      fontSize: 14,
      italics: true,
      alignment: "justify",
      margin: [0, 10],
    },
    precio: {
      fontSize: 16,
      bold: true,
      color: "#490D0B",
    },
    footer: {
      fontSize: 10,
      color: "#666666",
    },
  };

  const docDefinition: any = {
    content: pages,
    styles,
    footer: (currentPage, pageCount) => ({
      stack: [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 841.89,
              y2: 0,
              lineWidth: 1,
              lineColor: "#C69D75",
            },
          ],
          margin: [0, 5],
        },
        {
          text: `Página ${currentPage} de ${pageCount} - © ${new Date().getFullYear()} Tiaras Colombia`,
          style: "footer",
          alignment: "center",
        },
      ],
      margin: [40, 10],
    }),
    tagged: true,
    displayTitle: true,
    info: {
      title: "Tiaras Colombia",
      author: "Tiaras Colombia",
      subject: "Catálogo",
      keywords: "Productos",
    },
    pageOrientation: "landscape",
    background: () => ({
      canvas: [
        {
          type: "rect",
          x: 0,
          y: 0,
          w: 841.89,
          h: 595.28,
          color: "#FBF6E4",
        },
      ],
    }),
    pageMargins: [40, 60, 40, 60],
  };

  docDefinition.images = { ...docDefinition.images, ...images };

//   pdfMake.createPdf(docDefinition).download(`Catalogo_Tiaras_${fecha}.pdf`);
    pdfMake.createPdf(docDefinition).open();
};

export default generatePDF;
