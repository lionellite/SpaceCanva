# 📊 CSV Test Files for SpaceCanva Laboratory

## 🎯 Purpose

These CSV files are designed to test the CSV upload functionality in the SpaceCanva Laboratory. They contain sample exoplanet transit data that can be used to verify the upload process and error handling.

## 📁 Available Test Files

### 1. `exoplanet_sample_data.csv` - Basic Test Data
- **Purpose**: Simple test with valid exoplanet data
- **Records**: 10 sample exoplanet candidates
- **Format**: Clean data without comments
- **Use Case**: Basic functionality testing

### 2. `exoplanet_detailed_sample.csv` - Detailed Test Data
- **Purpose**: Comprehensive test with documentation
- **Records**: 15 sample exoplanet candidates
- **Format**: Includes header comments explaining each column
- **Use Case**: Testing with documented data

### 3. `exoplanet_invalid_sample.csv` - Error Testing Data
- **Purpose**: Test error handling and validation
- **Records**: 5 records with invalid data types
- **Format**: Contains intentionally invalid values
- **Use Case**: Testing error messages and validation

## 📋 Data Structure

All CSV files follow this structure:

| Column | Description | Unit | Example |
|--------|-------------|------|---------|
| `mission` | Space mission | - | kepler, tess, k2 |
| `period` | Orbital period | days | 3.52 |
| `duration` | Transit duration | hours | 2.5 |
| `depth` | Transit depth | ppm | 1000 |
| `impact` | Impact parameter | - | 0.3 |
| `snr` | Signal-to-noise ratio | - | 15.2 |
| `steff` | Stellar temperature | Kelvin | 5778 |
| `srad` | Stellar radius | R☉ | 1.0 |
| `slogg` | Stellar surface gravity | dex | 4.5 |
| `tmag` | TESS magnitude | mag | 12.5 |

## 🧪 Testing Scenarios

### ✅ **Valid Data Testing**
1. Upload `exoplanet_sample_data.csv`
2. Verify file is accepted
3. Check for "under implementation" message
4. Confirm file name appears in chat

### 📝 **Detailed Data Testing**
1. Upload `exoplanet_detailed_sample.csv`
2. Verify comments are handled gracefully
3. Check data processing (if implemented)
4. Confirm all 15 records are recognized

### ❌ **Error Handling Testing**
1. Upload `exoplanet_invalid_sample.csv`
2. Verify error handling for invalid data
3. Check appropriate error messages
4. Confirm graceful failure handling

### 🔍 **File Validation Testing**
1. Try uploading non-CSV files
2. Verify "Please select a valid CSV file" message
3. Test with empty files
4. Test with malformed CSV structure

## 🚀 How to Use

1. **Open SpaceCanva Laboratory**
2. **Click the CSV upload button** (📊 icon next to send button)
3. **Select one of the test files**
4. **Observe the behavior**:
   - File validation
   - Upload confirmation
   - Service status message
   - Error handling (if applicable)

## 📊 Expected Behavior

### Current Implementation (Under Development)
- ✅ File selection dialog opens
- ✅ CSV files are accepted
- ✅ Upload confirmation appears
- ✅ "Under implementation" message shows
- ❌ Actual data processing (not yet implemented)

### Future Implementation (When Backend is Ready)
- ✅ Data validation and parsing
- ✅ Exoplanet analysis results
- ✅ Visualization generation
- ✅ Statistical summaries
- ✅ Export capabilities

## 🔧 Technical Notes

- **File Encoding**: UTF-8
- **Line Endings**: Unix (LF)
- **Delimiter**: Comma (,)
- **Header**: First row contains column names
- **Comments**: Supported in detailed sample file

## 📈 Data Sources

The sample data is based on real exoplanet characteristics:
- **Kepler Mission**: NASA's planet-hunting mission
- **TESS Mission**: Transiting Exoplanet Survey Satellite
- **K2 Mission**: Kepler's extended mission
- **Realistic Values**: Based on actual exoplanet discoveries

## 🎯 Next Steps

When the CSV analysis service is implemented, these files will be used to:
1. **Validate data parsing**
2. **Test analysis algorithms**
3. **Verify visualization generation**
4. **Ensure error handling robustness**
5. **Performance testing with larger datasets**

---

**Note**: These are test files for development purposes. The actual CSV analysis service is currently under implementation and will be available soon.
