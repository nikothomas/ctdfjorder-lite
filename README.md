# ctdfjorder-lite

**ctdfjorder-lite** is a graphical user interface (GUI) application for processing and analyzing CTD (Conductivity, Temperature, Depth) data. It provides a user-friendly interface for running the **CTDFjorder Python package** without the need for command-line interaction.

## Documentation
- [CTDFjorder Python package](https://github.com/nikothomas/CTDFjorder)

- [Read the Docs](#https://nikothomas.github.io/CTDFjorder/CTDFjorder/CTDFjorder.html)

## Installation
Requires python
To install CTDFjorder-lite, follow these steps:

1. Download the latest release package for your operating system from the releases page.
2. Extract the downloaded package to a directory of your choice.
3. Run the CTDFjorder-lite executable file to launch the application.

## Usage

1. Launch the CTDFjorder-lite application.
2. Prepare a folder containing the RSK files you want to process and a master sheet Excel file named "FjordPhyto MASTER SHEET.xlsx".
3. Drag and drop the folder onto one of the drop boxes in the application window:
   - **Drop here to merge:** Merges all RSK files in the dropped folder.
   - **Drop here for default processing:** Runs the default processing pipeline on all RSK files in the dropped folder.
   - **Drop here for default processing + plots:** Runs the default processing pipeline and generates plots for all RSK files in the dropped folder.
4. The application will display a loading overlay with status updates while processing the files.
5. Once the processing is complete, the loading overlay will disappear, indicating that the processing is finished.
6. The processed files and any generated plots will be saved in the same folder as the input files.

## Configuration

CTDFjorder-lite looks for a master sheet Excel file named "FjordPhyto MASTER SHEET.xlsx" in the dropped folder. This file is used for estimating location information when it's not available in the RSK files.

## Contributing

Contributions to CTDFjorder-lite are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

CTDFjorder-lite is released under the MIT License.

## Acknowledgments

CTDFjorder-lite was developed by Nikolas Yanek-Chrones based on the CTDFjorder Python package created for the Fjord Phyto project. The **gsw library** was used for certain derived calculations.

## Citations

McDougall, T. J., & Barker, P. M. (2011). Getting started with TEOS-10 and the Gibbs Seawater (GSW) Oceanographic Toolbox. SCOR/IAPSO WG127.
