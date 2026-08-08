const fs = require('fs');

const formatterCode = `
    function formatVehicleNumber(val) {
      let v = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      let result = '';
      
      let stateCode = v.match(/^[A-Z]{1,2}/);
      if (stateCode) {
        result += stateCode[0];
        v = v.substring(stateCode[0].length);
      } else if (v.length > 0) {
        return v;
      }
      
      if (v.length > 0) {
        result += '-';
        let rtoCode = v.match(/^\\d{1,2}/);
        if (rtoCode) {
          result += rtoCode[0];
          v = v.substring(rtoCode[0].length);
        } else {
          let letters = v.match(/^[A-Z]+/);
          if(letters) return result + v;
        }
      }
      
      if (v.length > 0) {
        let series = v.match(/^[A-Z]{1,3}/);
        if (series) {
          result += series[0];
          v = v.substring(series[0].length);
        }
      }
      
      if (v.length > 0) {
        result += '-';
        let num = v.match(/^\\d{1,4}/);
        if (num) {
          result += num[0];
        } else {
          result += v;
        }
      }
      
      return result;
    }
`;

function injectFormatter(filePath, inputId) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already injected
    if (content.includes('formatVehicleNumber(')) {
        console.log(filePath + ' already has the formatter.');
        return;
    }

    // Find the document.addEventListener('DOMContentLoaded' ... line
    let domReadyIndex = content.indexOf("document.addEventListener('DOMContentLoaded'");
    if (domReadyIndex === -1) {
        console.log("Could not find DOMContentLoaded in " + filePath);
        return;
    }

    let injectionString = `
    ${formatterCode}
    const vehicleInput = document.getElementById('${inputId}');
    if (vehicleInput) {
        vehicleInput.addEventListener('input', function(e) {
            let cursor = this.selectionStart;
            let oldLength = this.value.length;
            this.value = formatVehicleNumber(this.value);
            // Adjust cursor position roughly
            let newLength = this.value.length;
            this.setSelectionRange(cursor + (newLength - oldLength), cursor + (newLength - oldLength));
        });
    }
`;

    // Inject right after the DOMContentLoaded opening bracket `{`
    let openBracketIndex = content.indexOf('{', domReadyIndex);
    if (openBracketIndex !== -1) {
        let newContent = content.substring(0, openBracketIndex + 1) + injectionString + content.substring(openBracketIndex + 1);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Injected successfully into ' + filePath);
    }
}

injectFormatter('assets/js/join-auto.js', 'auto-vehicle');
injectFormatter('assets/js/auto-loader.js', 'portal-edit-vehicle');
// For admin.js, the modal might not be in DOMContentLoaded, but we can just attach to document body using event delegation.
// Let's do event delegation for admin.js
let adminContent = fs.readFileSync('assets/js/admin.js', 'utf8');
if (!adminContent.includes('formatVehicleNumber(')) {
    let adminInjection = `
${formatterCode}
document.addEventListener('input', function(e) {
    if (e.target && e.target.id === 'edit-auto-vehicle') {
        let cursor = e.target.selectionStart;
        let oldLength = e.target.value.length;
        e.target.value = formatVehicleNumber(e.target.value);
        let newLength = e.target.value.length;
        e.target.setSelectionRange(cursor + (newLength - oldLength), cursor + (newLength - oldLength));
    }
});
`;
    adminContent = adminContent + "\\n" + adminInjection;
    fs.writeFileSync('assets/js/admin.js', adminContent, 'utf8');
    console.log('Injected into admin.js via event delegation.');
}

