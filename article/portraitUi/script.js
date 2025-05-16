document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    let currentLanguage = languageSelect.value;
    const dropdownContainer = document.getElementById('dropdownContainer');
    const generateEnJsonBtn = document.getElementById('generateEnJsonBtn');
    const generateZhJsonBtn = document.getElementById('generateZhJsonBtn');
    const copyJsonBtn = document.getElementById('copyJsonBtn');
    const jsonOutput = document.getElementById('jsonOutput');

    const selectElements = {};

    // 创建年龄选项（18-120）
    function createAgeOptions() {
        const options = [];
        for (let age = 18; age <= 120; age++) {
            options.push(age.toString());
        }
        return options;
    }

    // 获取所有列表文件
    async function getListFiles() {
        try {
            const response = await fetch('lists/');
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'));
            return links
                .map(link => link.href)
                .filter(href => href.endsWith('_list.txt'))
                .map(href => href.split('/').pop());
        } catch (error) {
            console.error('Error fetching list files:', error);
            return [];
        }
    }

    async function createDropdowns() {
        dropdownContainer.innerHTML = ''; // Clear existing dropdowns
        
        // 创建性别选择器
        const genderLabel = document.createElement('label');
        genderLabel.textContent = 'gender:';
        genderLabel.htmlFor = 'gender';
        const genderSelect = document.createElement('select');
        genderSelect.id = 'gender';
        selectElements['gender'] = genderSelect;

        // 添加性别选项
        const genderOptions = [
            { value: 'Man', text: 'Man:男性' },
            { value: 'Woman', text: 'Woman:女性' }
        ];
        genderOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            genderSelect.appendChild(option);
        });
        genderSelect.addEventListener('change', handleGenderChange);
        dropdownContainer.appendChild(genderLabel);
        dropdownContainer.appendChild(genderSelect);

        // 创建年龄选择器
        const ageLabel = document.createElement('label');
        ageLabel.textContent = 'age:';
        ageLabel.htmlFor = 'age';
        const ageSelect = document.createElement('select');
        ageSelect.id = 'age';
        selectElements['age'] = ageSelect;

        // 添加年龄选项
        createAgeOptions().forEach(age => {
            const option = document.createElement('option');
            option.value = age;
            option.textContent = age;
            ageSelect.appendChild(option);
        });
        dropdownContainer.appendChild(ageLabel);
        dropdownContainer.appendChild(ageSelect);

        // 获取并处理其他列表文件
        const listFiles = await getListFiles();
        for (const fileName of listFiles) {
            // 跳过性别和年龄文件（如果存在）
            if (fileName === 'gender_list.txt' || fileName === 'age_list.txt') continue;

            // 从文件名中提取类别信息
            const fileNameWithoutExt = fileName.replace('_list.txt', '');
            const categoryMatch = fileNameWithoutExt.match(/\((.*?)\)(.+)/);
            const chineseCategory = categoryMatch ? categoryMatch[1] : fileNameWithoutExt;
            const englishCategory = categoryMatch ? categoryMatch[2].replace(/[_-]/g, ' ').trim() : fileNameWithoutExt;
            
            const label = document.createElement('label');
            label.textContent = `${englishCategory}:`;
            label.htmlFor = englishCategory;

            const select = document.createElement('select');
            select.id = englishCategory;
            select.dataset.chineseCategory = chineseCategory;
            selectElements[englishCategory] = select;

            // 添加'none'选项（对于非必选字段）
            if (!['nationality', 'shot'].includes(englishCategory)) {
                const noneOption = document.createElement('option');
                noneOption.value = 'none';
                noneOption.textContent = 'none:无';
                select.appendChild(noneOption);
            }

            try {
                const response = await fetch(`lists/${fileName}`);
                if (!response.ok) {
                    console.error(`Failed to load ${fileName}: ${response.statusText}`);
                    const errorOption = document.createElement('option');
                    errorOption.value = '';
                    errorOption.textContent = `Error loading ${category}`;
                    select.appendChild(errorOption);
                    select.disabled = true;
                    continue;
                }
                const text = await response.text();
                const options = text.split('\n').map(line => line.trim()).filter(line => line);

                options.forEach(optionText => {
                    const option = document.createElement('option');
                    const parts = optionText.split(':');
                    const englishValue = parts[0].trim();
                    option.value = englishValue;
                    option.textContent = optionText;
                    select.appendChild(option);
                });
            } catch (error) {
                console.error(`Error fetching or processing ${fileName}:`, error);
                const errorOption = document.createElement('option');
                errorOption.value = '';
                errorOption.textContent = `Error loading ${category}`;
                select.appendChild(errorOption);
                select.disabled = true;
            }
            dropdownContainer.appendChild(label);
            dropdownContainer.appendChild(select);
        }
        // 初始检查性别相关字段
        handleGenderChange();
    }

    function handleGenderChange() {
        const genderSelect = selectElements['gender'];
        const beardSelect = selectElements['beard'];
        const beardColorSelect = selectElements['beard_color'];
        const femaleLingerieSelect = selectElements['female_lingerie'];

        console.log('handleGenderChange called');
        if (genderSelect) {
            console.log('Gender select found, value:', genderSelect.value);
        }
        if (femaleLingerieSelect) {
            console.log('Female lingerie select found');
        } else {
            console.log('Female lingerie select NOT found');
        }

        const isFemale = genderSelect && genderSelect.value === 'Woman';
        console.log('isFemale:', isFemale);

        // Beard and Beard Color: show if not female, hide if female, and set value to 'none' when hidden
        if (beardSelect) {
            if (isFemale) {
                beardSelect.value = 'none';
                if (beardSelect.previousElementSibling) beardSelect.previousElementSibling.classList.add('hidden');
                beardSelect.classList.add('hidden');
            } else {
                if (beardSelect.previousElementSibling) beardSelect.previousElementSibling.classList.remove('hidden');
                beardSelect.classList.remove('hidden');
            }
        }

        if (beardColorSelect) {
            if (isFemale) {
                beardColorSelect.value = 'none';
                if (beardColorSelect.previousElementSibling) beardColorSelect.previousElementSibling.classList.add('hidden');
                beardColorSelect.classList.add('hidden');
            } else {
                if (beardColorSelect.previousElementSibling) beardColorSelect.previousElementSibling.classList.remove('hidden');
                beardColorSelect.classList.remove('hidden');
            }
        }

        // Female Lingerie: show if female, hide if not female, and set value to 'none' when hidden
        if (femaleLingerieSelect) {
            console.log('Processing femaleLingerieSelect visibility');
            if (isFemale) {
                console.log('Gender is female, showing female lingerie');
                if (femaleLingerieSelect.previousElementSibling) {
                    console.log('Female lingerie label found, removing hidden class');
                    femaleLingerieSelect.previousElementSibling.classList.remove('hidden');
                } else {
                    console.log('Female lingerie label NOT found');
                }
                femaleLingerieSelect.classList.remove('hidden');
            } else {
                console.log('Gender is not female, hiding female lingerie');
                femaleLingerieSelect.value = 'none';
                if (femaleLingerieSelect.previousElementSibling) {
                    console.log('Female lingerie label found, adding hidden class');
                    femaleLingerieSelect.previousElementSibling.classList.add('hidden');
                } else {
                    console.log('Female lingerie label NOT found');
                }
                femaleLingerieSelect.classList.add('hidden');
            }
        } else {
            console.log('femaleLingerieSelect is null or undefined, cannot process visibility.');
        }
    }

    generateEnJsonBtn.addEventListener('click', () => generateJson('en'));
    generateZhJsonBtn.addEventListener('click', () => generateJson('zh'));

    languageSelect.addEventListener('change', (event) => {
        currentLanguage = event.target.value;
        createDropdowns(); // Re-create dropdowns with the new language
        jsonOutput.textContent = ''; // Clear previous JSON output
    });

    function generateJson(lang) {
        const result = {};
        let isValid = true;

        for (const category in selectElements) {
            const select = selectElements[category];
            const selectedOption = select.options[select.selectedIndex];
            const englishValue = select.value; // This is the part before ':' or 'none'

            if (englishValue === 'none' || englishValue === '') {
                // For mandatory fields, check if 'none' was selected when it shouldn't be.
                if (['gender', 'age', 'nationality', 'shot'].includes(category)) {
                    alert(`${category} 是必选项，不能为"无"。`);
                    isValid = false;
                    break;
                }
                // For non-mandatory fields, 'none' means we skip this category.
                continue;
            }

            // If the field is hidden (e.g., beard for female), skip it, even if it has a value other than 'none'.
            // This check might be redundant if hidden fields are always set to 'none', but it's safer.
            if (select.classList.contains('hidden')) {
                continue;
            }

            // Mandatory fields check (already handled if 'none' was selected, but good for clarity)
            if (['gender', 'age', 'nationality', 'shot'].includes(category)) {
                if (!englishValue) { // Should not happen if 'none' check is robust
                    alert(`${category} 是必选项。`);
                    isValid = false;
                    break;
                }
            }

            const fullText = selectedOption.textContent; // e.g., "Red:红色" or "male:男"
            const parts = fullText.split(':');

            const chineseCategory = select.dataset.chineseCategory;
            if (lang === 'en') {
                // 对于英文版本，使用category作为键名
                const key = category === 'age' ? 'age' : category;
                result[key] = englishValue;
            } else { // lang === 'zh'
                // 处理特殊键名（年龄和性别）
                let key;
                if (category === 'age') {
                    key = '年龄';
                } else if (category === 'gender') {
                    key = '性别';
                } else {
                    // 其他类别使用文件名中的中文类别作为键名
                    key = decodeURIComponent(select.dataset.chineseCategory) || category;
                }
                
                if (parts.length > 1) {
                    result[key] = parts[1].trim(); // 使用选项的中文部分作为值
                } else {
                    // 对于年龄这样的特殊字段，直接使用数值
                    result[key] = englishValue;
                    if (category !== 'age') {
                        console.warn(`Category ${category} with value ${englishValue} has no Chinese part in text: ${fullText}`);
                    }
                }
            }
        }

        if (isValid) {
            jsonOutput.textContent = JSON.stringify(result, null, 2);
        } else {
            jsonOutput.textContent = '';
        }
    }

    copyJsonBtn.addEventListener('click', () => {
        if (jsonOutput.textContent) {
            navigator.clipboard.writeText(jsonOutput.textContent)
                .then(() => alert('JSON已复制到剪贴板！'))
                .catch(err => console.error('无法复制JSON: ', err));
        } else {
            alert('请先生成JSON。');
        }
    });

    createDropdowns();
});