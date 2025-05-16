document.addEventListener('DOMContentLoaded', () => {
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
            const response = await fetch('available_lists.txt');
            if (!response.ok) {
                throw new Error('Failed to fetch available_lists.txt');
            }
            const text = await response.text();
            // 将文本按行分割并过滤掉空行
            return text.split('\n').filter(line => line.trim() !== '');
        } catch (error) {
            console.error('Error fetching available_lists.txt:', error);
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
            console.log('Processing file:', fileName); // Add log here
            // 跳过性别和年龄文件（如果存在）
            if (fileName === 'gender_list.txt' || fileName === 'age_list.txt') continue;

            // 从文件名中提取类别信息
            const fileNameWithoutExt = fileName.replace('_list.txt', '');
            const categoryMatch = fileNameWithoutExt.match(/\((.*?)\)(.+)/);
            const chineseCategory = categoryMatch ? categoryMatch[1] : fileNameWithoutExt;
            const englishCategory = categoryMatch ? categoryMatch[2].replace(/[_-]/g, ' ').trim() : fileNameWithoutExt.replace(/[_-]/g, ' ').trim(); // Apply replace to fileNameWithoutExt as well
            console.log('English category:', englishCategory); // Add log here
            
            const label = document.createElement('label');
            label.textContent = `${chineseCategory}:${englishCategory}`;
            label.htmlFor = englishCategory;

            const select = document.createElement('select');
            select.id = englishCategory;
            select.dataset.chineseCategory = chineseCategory;
            selectElements[englishCategory] = select;
            console.log('Added to selectElements with key:', englishCategory, selectElements[englishCategory]); // Add log here

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

                try { // New try block
                    options.forEach(optionText => {
                        const option = document.createElement('option');
                        const parts = optionText.split(':');
                        const englishValue = parts[0].trim();
                        option.value = englishValue;
                        option.textContent = optionText;
                        select.appendChild(option);
                    });
                } catch (processingError) { // New catch block
                    console.error(`Error processing options for ${fileName}:`, processingError);
                    const errorOption = document.createElement('option');
                    errorOption.value = '';
                    errorOption.textContent = `Error processing options for ${chineseCategory}`;
                    select.appendChild(errorOption);
                    select.disabled = true;
                }

            } catch (fetchError) { // Modified catch block
                console.error(`Error fetching ${fileName}:`, fetchError);
                const errorOption = document.createElement('option');
                errorOption.value = '';
                errorOption.textContent = `Error fetching ${chineseCategory}`;
                select.appendChild(errorOption);
                select.disabled = true;
            }
            dropdownContainer.appendChild(label);
            dropdownContainer.appendChild(select);
        }

        // 特殊处理 nationality2nd 文件，确保其被添加到 selectElements 中
        if (!selectElements['nationality2nd']) {
            const fileName = '(混合国籍)nationality2nd_list.txt';
            console.log('Processing special file:', fileName);
            const fileNameWithoutExt = fileName.replace('_list.txt', '');
            const categoryMatch = fileNameWithoutExt.match(/\((.*?)\)(.+)/);
            const chineseCategory = categoryMatch ? categoryMatch[1] : fileNameWithoutExt;
            const englishCategory = categoryMatch ? categoryMatch[2].replace(/[_-]/g, ' ').trim() : fileNameWithoutExt.replace(/[_-]/g, ' ').trim();
            console.log('English category:', englishCategory);

            const label = document.createElement('label');
            label.textContent = `${chineseCategory}:${englishCategory}`;
            label.htmlFor = englishCategory;

            const select = document.createElement('select');
            select.id = englishCategory;
            select.dataset.chineseCategory = chineseCategory;
            selectElements[englishCategory] = select;
            console.log('Added to selectElements with key:', englishCategory, selectElements[englishCategory]);

            // nationality2nd 是非必选字段，添加'none'选项
            const noneOption = document.createElement('option');
            noneOption.value = 'none';
            noneOption.textContent = 'none:无';
            select.appendChild(noneOption);

            try {
                const response = await fetch(`lists/${fileName}`);
                if (!response.ok) {
                    console.error(`Failed to load ${fileName}: ${response.statusText}`);
                    const errorOption = document.createElement('option');
                    errorOption.value = '';
                    errorOption.textContent = `Error loading ${chineseCategory}`;
                    select.appendChild(errorOption);
                    select.disabled = true;
                } else {
                    const text = await response.text();
                    const options = text.split('\n').map(line => line.trim()).filter(line => line);

                    try {
                        options.forEach(optionText => {
                            const option = document.createElement('option');
                            const parts = optionText.split(':');
                            const englishValue = parts[0].trim();
                            option.value = englishValue;
                            option.textContent = optionText;
                            select.appendChild(option);
                        });
                    } catch (processingError) {
                        console.error(`Error processing options for ${fileName}:`, processingError);
                        const errorOption = document.createElement('option');
                        errorOption.value = '';
                        errorOption.textContent = `Error processing options for ${chineseCategory}`;
                        select.appendChild(errorOption);
                        select.disabled = true;
                    }
                }
            } catch (fetchError) {
                console.error(`Error fetching ${fileName}:`, fetchError);
                const errorOption = document.createElement('option');
                errorOption.value = '';
                errorOption.textContent = `Error fetching ${chineseCategory}`;
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
        console.log('Current selectElements state:', selectElements); // Add log here
        const genderSelect = selectElements['gender'];
        const beardSelect = selectElements['beard'];
        const beardColorSelect = selectElements['beard color'];
        const femaleLingerieSelect = selectElements['female lingerie'];

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
            console.log('Beard select found');
            if (isFemale) {
                console.log('Hiding beard select and label');
                beardSelect.value = 'none';
                if (beardSelect.previousElementSibling) beardSelect.previousElementSibling.classList.add('hidden');
                beardSelect.classList.add('hidden');
            } else {
                console.log('Showing beard select and label');
                if (beardSelect.previousElementSibling) beardSelect.previousElementSibling.classList.remove('hidden');
                beardSelect.classList.remove('hidden');
            }
        }

        if (beardColorSelect) {
            console.log('Beard Color select found');
            if (isFemale) {
                console.log('Hiding beard color select and label');
                beardColorSelect.value = 'none';
                if (beardColorSelect.previousElementSibling) beardColorSelect.previousElementSibling.classList.add('hidden');
                beardColorSelect.classList.add('hidden');
            } else {
                console.log('Showing beard color select and label');
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
            let key;
            if (lang === 'zh') {
                if (category === 'gender') {
                    key = '性别';
                } else if (category === 'age') {
                    key = '年龄';
                } else {
                    key = chineseCategory;
                }
            } else {
                key = category;
            }
            
            let value;
            if (lang === 'zh') {
                // 对于中文，使用选项文本的中文部分
                value = parts.length > 1 ? parts[1].trim() : englishValue; // Fallback to englishValue if no Chinese part
            } else {
                // 对于英文，使用选项的英文值
                value = englishValue;
            }

            result[key] = value;
        }

        // 处理混合国籍
        const nationality1Select = selectElements['nationality'];
        const nationality2Select = selectElements['nationality2nd'];

        const nationality1Value = nationality1Select ? nationality1Select.value : 'none';
        const nationality2Value = nationality2Select ? nationality2Select.value : 'none';

        if (nationality2Value !== 'none' && nationality2Value !== '') {
            // 如果 nationality2nd 不为 none，则合并国籍
            let mixedRaceValue;
            if (lang === 'zh') {
                const nationality1Chinese = nationality1Select && nationality1Select.options[nationality1Select.selectedIndex].textContent.split(':')[1]?.trim();
                const nationality2Chinese = nationality2Select && nationality2Select.options[nationality2Select.selectedIndex].textContent.split(':')[1]?.trim();
                if (nationality1Value !== 'none' && nationality1Value !== '') {
                    mixedRaceValue = `${nationality1Chinese}/${nationality2Chinese}`;
                } else {
                    mixedRaceValue = nationality2Chinese;
                }
            } else {
                 if (nationality1Value !== 'none' && nationality1Value !== '') {
                     mixedRaceValue = `${nationality1Value}/${nationality2Value}`;
                 } else {
                     mixedRaceValue = nationality2Value;
                 }
            }
            result[lang === 'zh' ? '混合国籍' : 'Mixed race'] = mixedRaceValue;
            // 移除原始的 nationality 和 nationality2nd 字段
            delete result['nationality'];
            delete result['nationality2nd'];
        } else if (nationality1Value !== 'none' && nationality1Value !== '') {
             // 如果 nationality2nd 为 none，但 nationality1 不为 none，则保留 nationality1
             if (lang === 'zh') {
                 result[nationality1Select.dataset.chineseCategory] = nationality1Select.options[nationality1Select.selectedIndex].textContent.split(':')[1]?.trim();
             } else {
                 result['nationality'] = nationality1Value;
             }
             delete result['nationality2nd']; // 确保 nationality2nd 不存在
        } else {
             // 如果两个都为 none，则移除两个字段
             delete result['nationality'];
             delete result['nationality2nd'];
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