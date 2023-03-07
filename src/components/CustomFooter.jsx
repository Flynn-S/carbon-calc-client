import Box from "@mui/material/Box";
import { GridFooterContainer, GridFooter } from "@mui/x-data-grid";

export default function CustomFooter(props) {
  return (
    <GridFooterContainer>
      <div>Total : {props.total}</div>
      {/* Add what you want here */}
      <GridFooter
        sx={{
          border: "none", // To delete double border.
        }}
      />
    </GridFooterContainer>
  );
}
