import pdfMake from "pdfmake/build/pdfmake";
import { logo } from "../../../../assets/img";
import { Producto } from "../models/product/entities/Producto";
import { CartService } from "../models/product/services/cart.service";


const generatePDF = (
  products: Producto[],
  fecha: string,
  cartservice: CartService
) => {
  const tableBody = [
    [
      { text: "Imagen", style: "tableHeader", alignment: "center" },
      { text: "Nombre", style: "tableHeader", alignment: "center" },
      { text: "Descripción", style: "tableHeader", alignment: "center" },
      { text: "Precio", style: "tableHeader", alignment: "center" },
    ],
    ...products.map((product, index) => [
      { image: `image${index}`, width: 200 },
      { text: product.nombre, style: "texto", alignment: "center" },
      { text: product.descripcion, style: "texto"},
      { text: `$${product.precio}`, style: "texto", bold: true},
    ]),
  ];

  const images = products.reduce((acc, product, index) => {
    acc[`image${index}`] = `http://localhost:3000/tiaras/api/uploads/${product.imagenes?.[0]}`;
    return acc;
  }, {});

  const content: any[] = [];

  content.push({
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
  });

  content.push({ text: "\n" });

  content.push({
    table: {
      headerRows: 1,
      heights: (rowIndex: number) => {
        return rowIndex === 0 ? 'auto' : 150; 
      },
      widths: ['auto', 'auto', 'auto', 'auto'],
      body: tableBody,
    },
    layout: "lightHorizontalLines",
    margin: [0, 10, 0, 10],
  });

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
    texto:{
      fontSize: 14,
      italics: true,
      alignment: 'justify',
      valign: "middle",
    },
  };



  const docDefinition: any = {
    content,
    styles,
    tagged: true,
    displayTitle: true,
    info: {
      title: 'Tiaras Colombia',
      author: 'Tiaras Colombia',
      subject: 'Catálogo',
      keywords: 'Productos',
      },
      pageOrientation: "portrait",
    // Configurar fondo de todo el documento
    background: () => {
      return {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 595.28,  // Ancho estándar A4 en puntos (21cm)
            h: 841.89,  // Alto estándar A4 en puntos (29.7cm)
            // w: 841.89,  // Ancho estándar A4 en puntos (29.7cm) para landscape
            // h: 595.28,  // Alto estándar A4 en puntos (21cm) para landscape
            color: '#FBF6E4'
          }
        ]
      };
    },
    pageMargins: [40, 60, 40, 60],
  };

  docDefinition.images = { ...docDefinition.images, ...images };

  pdfMake.createPdf(docDefinition).open();
};
export default generatePDF;
