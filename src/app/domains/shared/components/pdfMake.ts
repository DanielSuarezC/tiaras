import pdfMake from "pdfmake/build/pdfmake";
import { logo } from "../../../../assets/img";
import { Producto } from "../models/product/entities/Producto";
import { CartService } from "../models/product/services/cart.service";

const generatePDF = (
  products: Producto[],
  fecha: string,
  cartService: CartService
) => {
  const productsPerPage = 1; // Máximo 3 productos por página
  const pages = [];

  const images = products.reduce((acc, product, index) => {
    acc[`image${index}`] = `http://localhost:3000/tiaras/api/uploads/${product.imagenes?.[0]}`;
    return acc;
  }, {});

  for (let i = 0; i < products.length; i += productsPerPage) {
    const productChunk = products.slice(i, i + productsPerPage);

    const tableBody = [
      [
        { text: "Imagen", style: "tableHeader", alignment: "center" },
        { text: "Nombre", style: "tableHeader", alignment: "center" },
        { text: "Descripción", style: "tableHeader", alignment: "center" },
        { text: "Precio", style: "tableHeader", alignment: "center" },
      ],
      ...productChunk.map((product, index) => [
        { image: `image${i + index}`, width: 200, height: 200, margin: [0, 10] },
        { text: product.nombre, style: "texto", alignment: "center", margin: [0, 10] },
        { text: product.descripcion, style: "texto", margin: [0, 10] },
        { text: `$${product.precio}`, style: "precio", margin: [0, 10] },
      ]),
    ];

    pages.push({
      stack: [
        {
          columns: [
            { image: logo.miVar, width: 100 },
            {
              stack: [
                {
                  text: `Fecha: ${fecha}    |    Síguenos en Instagram`,
                  style: "subheader",
                  alignment: "right",
                },
                {
                  qr: "https://www.instagram.com/tiarascol/",
                  fit: 100,
                  alignment: "right",
                  margin: [0, 10, 0, 10],
                },
              ],
              alignment: "right",
            },
          ],
        },
        { text: "\n" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "auto", "auto", "auto"],
            body: tableBody,
          },
          layout: "lightHorizontalLines",
          margin: [0, 10, 0, 10],
        },
      ],
      pageBreak: i + productsPerPage < products.length ? "after" : undefined, // Salto de página
    });
  }

  const styles = {
    header: {
      fontSize: 14,
      bold: true,
    },
    subheader: {
      fontSize: 12,
      margin: [0, 5, 0, 5],
    },
    tableHeader: {
      bold: true,
      fontSize: 14,
      color: "black",
      fillColor: "#C69D75",
      alignment: "center",
    },
    texto: {
      fontSize: 14,
      italics: true,
      alignment: "justify",
      valign: "middle",
    },
    precio: {
      fontSize: 14,
      bold: true,
      alignment: "justify",
      valign: "middle",
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
              x2: 841.89, // Adjusted for landscape orientation
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
          w: 841.89, // Adjusted for landscape orientation
          h: 595.28, // Adjusted for landscape orientation
          color: "#FBF6E4",
        },
      ],
    }),
    pageMargins: [40, 60, 40, 60],
  };

  docDefinition.images = { ...docDefinition.images, ...images };

  // pdfMake.createPdf(docDefinition).download(`Catalogo_Tiaras_${fecha}.pdf`);
  pdfMake.createPdf(docDefinition).open();

};


export default generatePDF;
