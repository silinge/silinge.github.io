document.addEventListener('DOMContentLoaded', () => {
    const dropdownContainer = document.getElementById('dropdownContainer');
    const generateEnJsonBtn = document.getElementById('generateEnJsonBtn');
    const generateZhJsonBtn = document.getElementById('generateZhJsonBtn');
    const copyJsonBtn = document.getElementById('copyJsonBtn');
    const jsonOutput = document.getElementById('jsonOutput');
    const enumerationSelect = document.getElementById('enumerationSelect');
    const generateEnumerateEnBtn = document.getElementById('generateEnumerateEnBtn');
    const generateEnumerateZhBtn = document.getElementById('generateEnumerateZhBtn');

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
        const genderCard = document.createElement('div');
        genderCard.classList.add('dropdown-card');
        genderCard.appendChild(genderLabel);
        genderCard.appendChild(genderSelect);
        dropdownContainer.appendChild(genderCard);

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
        const ageCard = document.createElement('div');
        ageCard.classList.add('dropdown-card');
        ageCard.appendChild(ageLabel);
        ageCard.appendChild(ageSelect);
        dropdownContainer.appendChild(ageCard);

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
            const card = document.createElement('div');
            card.classList.add('dropdown-card');
            card.appendChild(label);
            card.appendChild(select);
            dropdownContainer.appendChild(card);
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
            const nationality2ndCard = document.createElement('div');
            nationality2ndCard.classList.add('dropdown-card');
            nationality2ndCard.appendChild(label);
            nationality2ndCard.appendChild(select);
            dropdownContainer.appendChild(nationality2ndCard);
        }

        // 初始检查性别相关字段
        handleGenderChange();
        populateEnumerationSelect(listFiles); // Call this after listFiles is guaranteed to be populated
    }

    // Populate enumeration select dropdown
    function populateEnumerationSelect(listFiles) {
        // Add age as an option for enumeration
        const ageOption = document.createElement('option');
        ageOption.value = 'age_list.txt'; // Use a consistent identifier
        ageOption.textContent = '年龄 (age)';
        enumerationSelect.appendChild(ageOption);

        listFiles.forEach(fileName => {
            if (fileName === 'gender_list.txt') return; // Gender is not typically enumerated in this context

            const option = document.createElement('option');
            option.value = fileName;
            // Extract a user-friendly name from the fileName
            const fileNameWithoutExt = fileName.replace('_list.txt', '');
            const categoryMatch = fileNameWithoutExt.match(/\((.*?)\)(.+)/);
            const displayName = categoryMatch ? `${categoryMatch[1]} (${categoryMatch[2].replace(/[_-]/g, ' ').trim()})` : fileNameWithoutExt.replace(/[_-]/g, ' ').trim();
            option.textContent = displayName;
            enumerationSelect.appendChild(option);
        });
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

    // Function to copy JSON to clipboard
    function copyJsonToClipboard() {
        const jsonString = jsonOutput.textContent;
        if (navigator.clipboard && jsonString) {
            navigator.clipboard.writeText(jsonString)
                .then(() => {
                    showCopyNotification('JSON 已复制到剪贴板!');
                })
                .catch(err => {
                    console.error('无法复制 JSON: ', err);
                    showCopyNotification('复制失败，请手动复制。', true);
                });
        } else if (jsonString) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = jsonString;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showCopyNotification('JSON 已复制到剪贴板!');
            } catch (err) {
                console.error('无法复制 JSON (fallback): ', err);
                showCopyNotification('复制失败，请手动复制。', true);
            }
            document.body.removeChild(textArea);
        } else {
            showCopyNotification('没有可复制的JSON内容。', true);
        }
    }

    // Function to show copy notification
    function showCopyNotification(message, isError = false) {
        console.log('showCopyNotification called with message:', message, 'isError:', isError); // Log when function is entered
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.classList.add('copy-notification');
        if (isError) {
            notification.classList.add('error');
        }

        // Style for fixed position near the copy button
        const copyBtnRect = copyJsonBtn.getBoundingClientRect();
        notification.style.position = 'fixed'; // Use fixed positioning
        notification.style.top = `${copyBtnRect.bottom + 5}px`;
        notification.style.left = `${copyBtnRect.left}px`;
        notification.style.transform = 'translateX(-50%)'; // Adjust to center if needed, or align left
        notification.style.zIndex = '1000'; // Ensure it's on top
        notification.style.border = '2px solid red'; // Add red border for visibility

        document.body.appendChild(notification);
        console.log('Notification element appended to DOM:', notification);
        console.log(`Notification position: top=${notification.style.top}, left=${notification.style.left}`);


        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

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
            if (lang === 'zh') {
                delete result['国籍']; // Delete Chinese key
            } else {
                delete result['nationality']; // Delete English key
            }
            delete result['nationality2nd']; // Always delete nationality2nd (English key)
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
                .then(() => {
                    console.log('JSON copied to clipboard successfully.'); // Add log here
                    showCopyNotification('JSON已复制到剪贴板！', 'Copied!');
                })
                .catch(err => {
                    console.error('Failed to copy JSON: ', err); // Add log here
                });
        } else {
            // No JSON to copy, maybe show a different message or do nothing
            console.log('No JSON content to copy.');
        }
    });

    function showCopyNotification(zhText, enText) {
    console.log('showCopyNotification function entered'); // Add log here
    console.log('showCopyNotification called'); // Add log here
        const notification = document.createElement('span');
        notification.textContent = navigator.language.startsWith('zh') ? zhText : enText;
        notification.classList.add('copy-notification');
        
        // Position the notification relative to the copy button
        const rect = copyJsonBtn.getBoundingClientRect();
        notification.style.position = 'fixed';
        notification.style.top = `${rect.bottom + 5}px`; // 5px below the button
        notification.style.left = `${rect.left}px`;
        notification.style.backgroundColor = '#4CAF50'; // Green background
        notification.style.color = 'white';
        notification.style.padding = '4px 8px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '1000'; // Ensure it's on top
        notification.style.opacity = '1';
        notification.style.transition = 'opacity 0.5s ease-in-out';
        notification.style.border = '2px solid red'; // Add a border for visibility

        document.body.appendChild(notification);
        console.log('Notification element appended to body'); // Add log here
        console.log(`Notification position: top=${rect.bottom + 5}px, left=${rect.left}px`); // Log position

        // Fade out and remove after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 500); // Remove after fade out completes
        }, 2000);
    }

    // Generate JSON for enumeration
    async function generateEnumerationJson(language) {
        const selectedValues = {};
        const enumerationTarget = enumerationSelect.value;
        let enumerationKey = '';
        let enumerationChineseKey = '';

        // Get base selected values, excluding the enumeration target if it's a standard dropdown
        for (const key in selectElements) {
            const select = selectElements[key];
            const selectedOption = select.options[select.selectedIndex];
            if (!selectedOption || selectedOption.value === 'none') continue;

            // Determine the key for the JSON output
            let jsonKey = key;
            if (key === 'gender' || key === 'age') {
                jsonKey = key;
            } else {
                // For other dropdowns, use the English category from the dataset or fallback
                jsonKey = select.id; // select.id should be the English category name
            }

            // If this key is the enumeration target, store its original key and skip adding it to base selectedValues
            if (enumerationTarget && enumerationTarget.includes(key.replace(/ /g, ''))) { // Check if current key is part of enumeration target filename
                enumerationKey = jsonKey;
                enumerationChineseKey = select.dataset.chineseCategory || key;
                continue; // Skip adding to base if it's the one to be enumerated
            }
            if (enumerationTarget === 'age_list.txt' && key === 'age'){
                enumerationKey = 'age';
                enumerationChineseKey = '年龄';
                continue;
            }

            if (language === 'en') {
                selectedValues[jsonKey] = selectedOption.value;
            } else {
                const chineseValue = selectedOption.textContent.includes(':') ? selectedOption.textContent.split(':')[1] : selectedOption.value;
                const chineseKey = select.dataset.chineseCategory || jsonKey;
                selectedValues[chineseKey] = chineseValue;
            }
        }

        if (!enumerationTarget) {
            jsonOutput.textContent = JSON.stringify(selectedValues, null, 2);
            return;
        }

        // Fetch and process the enumeration list
        let enumerationItems = [];
        if (enumerationTarget === 'age_list.txt') {
            enumerationItems = createAgeOptions(); // Use existing age options function
            if (language === 'zh') {
                 // For Chinese, age is just the number
            } else {
                // For English, age is just the number
            }
            if (!enumerationKey) { // if age was not in selectElements (e.g. if it was removed or changed)
                enumerationKey = 'age';
                enumerationChineseKey = '年龄';
            }
        } else {
            try {
                const response = await fetch(`lists/${enumerationTarget}`);
                if (!response.ok) throw new Error(`Failed to load ${enumerationTarget}`);
                const text = await response.text();
                enumerationItems = text.split('\n').map(line => line.trim()).filter(line => line);

                // Determine the enumerationKey if not already set (e.g. from a dynamic list)
                if (!enumerationKey) {
                    const fileNameWithoutExt = enumerationTarget.replace('_list.txt', '');
                    const categoryMatch = fileNameWithoutExt.match(/\((.*?)\)(.+)/);
                    enumerationChineseKey = categoryMatch ? categoryMatch[1] : fileNameWithoutExt;
                    enumerationKey = categoryMatch ? categoryMatch[2].replace(/[_-]/g, ' ').trim() : fileNameWithoutExt.replace(/[_-]/g, ' ').trim();
                }
            } catch (error) {
                console.error('Error loading enumeration list:', error);
                jsonOutput.textContent = `Error loading enumeration list: ${error.message}`;
                return;
            }
        }

        const allGeneratedJson = [];
        enumerationItems.forEach(item => {
            const currentJson = { ...selectedValues };
            let itemValueEn = item;
            let itemValueZh = item;

            if (item.includes(':')) {
                const parts = item.split(':');
                itemValueEn = parts[0].trim();
                itemValueZh = parts[1].trim();
            }

            if (language === 'en') {
                currentJson[enumerationKey] = itemValueEn;
            } else {
                currentJson[enumerationChineseKey] = itemValueZh;
            }
            allGeneratedJson.push(currentJson);
        });

        jsonOutput.textContent = allGeneratedJson.map(obj => JSON.stringify(obj, null, 2)).join('\n\n');
    }

    generateEnJsonBtn.addEventListener('click', () => generateJson('en'));
    generateZhJsonBtn.addEventListener('click', () => generateJson('zh'));
    copyJsonBtn.addEventListener('click', copyJsonToClipboard);
    // generateEnumerationBtn.addEventListener('click', () => {
    //     // Determine language from a conventional JSON button or default to English
    //     // This part might need refinement based on how you want to select the language for enumeration
    //     generateEnumerationJson('en'); // Defaulting to English for now
    // });

    generateEnumerateEnBtn.addEventListener('click', () => generateEnumerationJson('en'));
    generateEnumerateZhBtn.addEventListener('click', () => generateEnumerationJson('zh'));

    // Initial call to create dropdowns when the DOM is fully loaded
    createDropdowns();
});