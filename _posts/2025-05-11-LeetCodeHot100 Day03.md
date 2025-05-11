---
layout: post
title: "LeetCodeHot100 Day03"
subtitle: "滑动窗口，启动！"
date: 2025-05-11 11:00:00
author: "sorrymaker"
header-img: "img/image-20250511112719376.png"
catalog: true
tags:
  - java
---

<img src="/img/image-20250511102417456.png" alt="image-20250511102417456" style="zoom: 67%;" />

<img src="/img/image-20250511102433729.png" alt="image-20250511102433729" style="zoom:67%;" />

## 1.无重复字符的最长子串

![image-20250511112232675](/img/image-20250511112232675.png)

### 解题思路

**哈希表 _dic_ 统计：** 指针 _j_ 遍历字符 _s_ ，哈希表统计字符 _s_[*j*] **最后一次出现的索引** 。

**更新左指针 _i_ ：** 根据上轮左指针 _i_ 和 _d**i**c_[_s_[*j*]] ，每轮更新左边界 _i_ ，保证区间 [*i*+1,*j*] 内无重复字符且最大。

_i_=max(_d**i**c_[_s_[*j*]],_i_)

**更新结果 _res_ ：** 取上轮 _res_ 和本轮双指针区间 [*i*+1,*j*] 的宽度（即 *j*−*i* ）中的最大值。

_res_=max(_res_,*j*−*i*)

![image-20250511105531340](/img/image-20250511105531340.png)

![image-20250511105535716](/img/image-20250511105535716.png)

![image-20250511105540618](/img/image-20250511105540618.png)

![image-20250511105545925](/img/image-20250511105545925.png)

![image-20250511105550470](/img/image-20250511105550470.png)

![image-20250511105555335](/img/image-20250511105555335.png)

![image-20250511105600089](/img/image-20250511105600089.png)

![image-20250511105605292](/img/image-20250511105605292.png)

![image-20250511105609933](/img/image-20250511105609933.png)

![image-20250511105615376](/img/image-20250511105615376.png)

### 代码

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
         Map<Character,Integer> map = new HashMap<>();
        int i = -1,res = 0,lens = s.length();

        for (int j = 0; j < lens; j++) {
            if(map.containsKey(s.charAt(j))){
                i = Math.max(i,map.get(s.charAt(j)));// 更新左指针 i
            }
            map.put(s.charAt(j),j);// 哈希表记录
            res = Math.max(res,j - i);// 更新结果
        }
            return res;
    }
}
```

### 复杂度分析

- **时间复杂度 _O_(_N_) ：** 其中 _N_ 为字符串长度，动态规划需遍历计算 _d_ _p_ 列表。

- **空间复杂度 _O_(1) ：** 字符的 ASCII 码范围为 0 ~ 127 ，哈希表 _d**i**c_ 最多使用 _O_(128)=_O_(1) 大小的额外空间。

## 2.找到字符串中所有字母异位词

![image-20250511112255431](/img/image-20250511112255431.png)

### 解题思路

枚举 _s_ 的所有长为 _n_ 的子串 _s_′，如果 _s_′ 的每种字母的出现次数，和 _p_ 的每种字母的出现次数都相同，那么 _s_′ 是 _p_ 的异位词。

本题维护长为 _n_ 的子串 _s_′ 的每种字母的出现次数。如果 _s_′ 的每种字母的出现次数，和 _p_ 的每种字母的出现次数都相同，那么 _s_′ 是 _p_ 的异位词，把 _s_′ 左端点下标加入答案。

### 代码

```java
class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> res = new ArrayList<>();
        int[] cntP = new int[26];// 统计 p 的每种字母的出现次数
        int[] cntS = new int[26];// 统计 s 的长为 p.length() 的子串 s' 的每种字母的出现次数

        for(char c : p.toCharArray()){
            cntP[c - 'a']++;// 统计 p 的字母个数
        }

        for (int right = 0; right < s.length(); right++) {
            cntS[s.charAt(right) - 'a']++;// 右端点字母进入窗口
            int left = right - p.length() + 1;
            if(left < 0){// 窗口长度不足 p.length()
                continue;
            }
            if(Arrays.equals(cntP,cntS)){
                res.add(left); //s' 左端点下标加入答案
            }
            cntS[s.charAt(left) - 'a']--;// 左端点字母离开窗口
        }
            return res;
    }
}
```

### 复杂度分析

- 时间复杂度：O(∣Σ∣*m*+_n_)，其中 _m_ 是 _s_ 的长度，_n_ 是 _p_ 的长度，∣Σ∣=26 是字符集合的大小

- 空间复杂度：O(∣Σ∣)。返回值不计入

## 总结

![image-20250511112719376](/img/image-20250511112719376.png)

![image-20250511112745768](/img/image-20250511112745768.png)
