import os
import cv2
import json
import numpy as np

photo_sizes = [
    ("9_16", (1024, 576, 3)),
    ("16_9", (576, 1024, 3)),
    ("3_4", (1024, 768, 3)),
    ("4_3", (768, 1024, 3)),
    ("3_4", (1024, 768, 3)),
    ("4_3", (768, 1024, 3)),
]

curr_file_list = os.listdir('assets/photos')
idx = len(curr_file_list)

font                   = cv2.FONT_HERSHEY_SIMPLEX
fontScale              = 4
fontColor              = (150,213,238)
thickness              = 10
lineType               = 2


for _ in range(30):
    rand_idx = np.random.randint(len(photo_sizes))
    ratio, wh = photo_sizes[rand_idx]
    img = np.zeros(wh, dtype=np.uint8)
    img[..., 0] = 238
    img[..., 1] = 174
    img[..., 2] = 149

    number = f"{idx}"
    number_width, number_height = cv2.getTextSize(number, font, fontScale, thickness)[0]
    number_coords = (
        int(img.shape[1] / 2) - int(number_width / 2), 
        int(img.shape[0] / 2) + int(number_height / 2) - number_height
    )

    ratio_text = f"{ratio.replace('_', ':')}"
    ratio_text_width, ratio_text_height = cv2.getTextSize(ratio_text, font, fontScale, thickness)[0]
    ratio_text_coords = (
        int(img.shape[1] / 2) - int(ratio_text_width / 2), 
        int(img.shape[0] / 2) + int(ratio_text_height / 2) + ratio_text_height
    )


    cv2.putText(img, number, 
        number_coords, 
        font, 
        fontScale,
        fontColor,
        thickness,
        lineType
    )
    cv2.putText(img, ratio_text, 
        ratio_text_coords, 
        font, 
        fontScale,
        fontColor,
        thickness,
        lineType
    )

    path = os.path.join(
        'assets', 'photos',
        f"{idx:04d}_{ratio}.png"
    )
    idx += 1

    cv2.imwrite(path, img)


curr_file_list = os.listdir('assets/photos')
with open(os.path.join('assets', 'file_list.json'), 'w') as f:
    json.dump(curr_file_list, f, indent=4)